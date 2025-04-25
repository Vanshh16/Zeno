const express = require("express");
const cors = require("cors");
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { Server } = require("socket.io");
const Valkey = require("ioredis");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const router = express.Router();
const prisma = new PrismaClient({});

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const serviceUri = process.env.REDIS_SERVICE_URI || "redis://localhost:6379";
const CLUSTER = process.env.CLUSTER;
const TASK = process.env.TASK;
const subnets = process.env.SUBNETS.split(",");
const securityGroups = process.env.SECURITY_GROUPS.split(",");

const subscriber = new Valkey(serviceUri);

const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });
});
io.listen(9001, () => console.log("Socket Server 9001"));

const ecsClient = new ECSClient({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const config = {
  CLUSTER: CLUSTER,
  TASK: TASK,
};

// Project registration
router.post("/project", async (req, res) => {
  const schema = z.object({
    gitURL: z.string().url(),
    name: z.string(),
  });
  const safeParseResult = schema.safeParse(req.body);
  if (safeParseResult.error) {
    return res.status(400).json({ error: safeParseResult.error });
  }
  const { gitURL, name } = safeParseResult.data;
  console.log(req.user);
  const project = await prisma.project.create({
    
    
    data: {
      name,
      gitURL,
      subDomain: generateSlug(),
      user: {
        connect: {
          id: req.user.userId,
        },
      },
    },
  });
  return res.status(200).json({ status: "success", data: { project } });
});
router.post("/deploy", async (req, res) => {
  const { projectId } = req.body;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project) return res.status(404).json({ error: "Project not found" });

  // Check if there is no running deployment
  console.log("Project: ", project);

  const deployment = await prisma.deployment.create({
    data: {
      project: { connect: { id: projectId } },
      status: "QUEUED",
    },
  });

  console.log("Deployment: ", deployment);

  // Spin the container
  const command = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: subnets,
        securityGroups: securityGroups,
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            { name: "GIT_REPOSITORY__URL", value: project.gitURL },
            { name: "PROJECT_ID", value: projectId },
            { name: "DEPLOYMENT_ID", value: deployment.id },
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);

  return res
    .status(200)
    .json({
      status: "queued",
      data: {
        projectSlug: project.subDomain,
        url: `http://${project.subDomain}.localhost:8000`,
      },
    });
});

router.get("/project-details/:id", async (req, res) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });
  if (!project) return res.status(404).json({ error: "Project not found" });

  return res.status(200).json({ project });
});

router.get("/logs/:id", async (req, res) => {
  const { id } = req.params;

  const logs = await prisma.log.findMany({
    where: { id: id },
    orderBy: { createdAt: "asc" }, // Fetch logs in order
  });
  const rawLogs = logs.json();
  return res.json({ rawLogs });
});

async function iniRedisSubsribe() {
  console.log("Subscribed to logs");

  subscriber.psubscribe("logs:*");
  subscriber.on("pmessage", async (pattern, channel, message) => {
    const projectID = channel.split(":")[1];

    const { PROJECT_ID, DEPLOYMENT_ID, log } = message;
    console.log(message);

    // await prisma.log.create({
    //     data: {
    //         id: uuidv4(),
    //         project: { connect: { id: projectID }},
    //         projectId: PROJECT_ID,
    //         deploymentId: DEPLOYMENT_ID,
    //         log: log
    //     }
    // })

    io.to(channel).emit("message", message);
  });
}

iniRedisSubsribe();

module.exports = router;
