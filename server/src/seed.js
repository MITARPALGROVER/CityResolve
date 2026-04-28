import bcrypt from 'bcryptjs';
import { config, requireConfig } from './config.js';
import { connectDb } from './db.js';
import { User } from './models/User.js';
import { Issue } from './models/Issue.js';
import { ActivityEvent } from './models/ActivityEvent.js';
import { Comment } from './models/Comment.js';
import { Vote } from './models/Vote.js';
import { Notification } from './models/Notification.js';

const issueTemplates = [
  {
    title: 'Deep pothole on Main Street near junction',
    description: 'Large pothole causing two-wheelers to swerve near the traffic signal.',
    category: 'road',
    severity: 'high',
    status: 'pending',
    addressLabel: 'Main Street Junction, Sector 4',
    lat: 28.6139,
    lng: 77.209,
    upvoteCount: 6,
    commentCount: 2,
    progressPercent: 18,
    ageDays: 1,
  },
  {
    title: 'Broken streetlight outside Riverside Park gate',
    description: 'The entry stretch is dark after 8 PM and unsafe for walkers.',
    category: 'light',
    severity: 'medium',
    status: 'inprogress',
    addressLabel: 'Riverside Park Gate, Ward 6',
    lat: 28.6211,
    lng: 77.2152,
    upvoteCount: 4,
    commentCount: 1,
    progressPercent: 62,
    ageDays: 3,
  },
  {
    title: 'Water leakage flooding the footpath',
    description: 'Continuous pipeline leak creating standing water and slippery pavement.',
    category: 'water',
    severity: 'high',
    status: 'inprogress',
    addressLabel: 'Lake View Road, Block B',
    lat: 28.6071,
    lng: 77.1988,
    upvoteCount: 5,
    commentCount: 3,
    progressPercent: 71,
    ageDays: 6,
  },
  {
    title: 'Overflowing garbage near community market',
    description: 'Uncollected waste has spilled onto the roadside for the last two days.',
    category: 'waste',
    severity: 'medium',
    status: 'pending',
    addressLabel: 'Community Market Lane, Sector 8',
    lat: 28.6184,
    lng: 77.2245,
    upvoteCount: 3,
    commentCount: 2,
    progressPercent: 22,
    ageDays: 2,
  },
  {
    title: 'Fallen tree branch blocking cycling track',
    description: 'A large branch is obstructing the greenway and needs removal.',
    category: 'park',
    severity: 'medium',
    status: 'resolved',
    addressLabel: 'Greenway Cycling Track, Ward 3',
    lat: 28.6252,
    lng: 77.2031,
    upvoteCount: 2,
    commentCount: 1,
    progressPercent: 100,
    ageDays: 10,
  },
  {
    title: 'Damaged divider signage near flyover',
    description: 'Reflective signage has come off and drivers miss the lane merge.',
    category: 'road',
    severity: 'low',
    status: 'resolved',
    addressLabel: 'East Flyover Merge, Zone 2',
    lat: 28.6325,
    lng: 77.2314,
    upvoteCount: 1,
    commentCount: 0,
    progressPercent: 100,
    ageDays: 14,
  },
  {
    title: 'Blocked storm drain before school entrance',
    description: 'Drainage is clogged and water backs up during school pickup hours.',
    category: 'water',
    severity: 'critical',
    status: 'pending',
    addressLabel: 'St. Mary School Road, Sector 5',
    lat: 28.6018,
    lng: 77.2216,
    upvoteCount: 7,
    commentCount: 4,
    progressPercent: 14,
    ageDays: 4,
  },
  {
    title: 'Illegal dumping beside metro pillar',
    description: 'Construction debris and waste dumped beside the metro access path.',
    category: 'waste',
    severity: 'high',
    status: 'inprogress',
    addressLabel: 'Metro Access Road, Pillar 18',
    lat: 28.6104,
    lng: 77.2362,
    upvoteCount: 5,
    commentCount: 2,
    progressPercent: 64,
    ageDays: 9,
  },
  {
    title: 'Park sprinkler running continuously',
    description: 'Water sprinklers are left on through midday causing water waste.',
    category: 'park',
    severity: 'low',
    status: 'resolved',
    addressLabel: 'Central Eco Park Lawn',
    lat: 28.6172,
    lng: 77.1911,
    upvoteCount: 2,
    commentCount: 1,
    progressPercent: 100,
    ageDays: 18,
  },
  {
    title: 'Signal timer malfunction at market crossing',
    description: 'The pedestrian timer is stuck and traffic is bunching during rush hour.',
    category: 'road',
    severity: 'high',
    status: 'inprogress',
    addressLabel: 'Market Crossing, Ward 9',
    lat: 28.6239,
    lng: 77.2276,
    upvoteCount: 6,
    commentCount: 3,
    progressPercent: 82,
    ageDays: 12,
  },
  {
    title: 'Streetlight flickering in residential lane',
    description: 'Light flickers through the night and the lane remains dim.',
    category: 'light',
    severity: 'low',
    status: 'pending',
    addressLabel: 'Rose Avenue, Block C',
    lat: 28.6299,
    lng: 77.2126,
    upvoteCount: 2,
    commentCount: 1,
    progressPercent: 16,
    ageDays: 7,
  },
  {
    title: 'Open manhole without warning barrier',
    description: 'Maintenance left an open manhole exposed near the bus stop.',
    category: 'other',
    severity: 'critical',
    status: 'rejected',
    addressLabel: 'Bus Stop 12, Outer Ring Road',
    lat: 28.6058,
    lng: 77.2063,
    upvoteCount: 4,
    commentCount: 2,
    progressPercent: 0,
    ageDays: 5,
  },
];

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function ensureUser({ email, name, role, password, points, level, badges }) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({
    email,
    name,
    role,
    passwordHash,
    points,
    level,
    badges,
  });
}

async function run() {
  requireConfig();
  await connectDb();

  const admin = await ensureUser({
    email: 'admin@cityresolve.local',
    name: 'City Admin',
    role: 'admin',
    password: 'Admin123!',
    points: 500,
    level: 5,
    badges: ['founder'],
  });

  const demoCitizen = await ensureUser({
    email: 'citizen@cityresolve.local',
    name: 'Demo Citizen',
    role: 'citizen',
    password: 'Citizen123!',
    points: 220,
    level: 2,
    badges: ['First Report'],
  });

  const moreCitizens = await Promise.all([
    ensureUser({ email: 'mitarpal@cityresolve.local', name: 'Mitarpal Grover', role: 'citizen', password: 'Citizen123!', points: 340, level: 3, badges: ['First Report', 'Community Voice'] }),
    ensureUser({ email: 'evelyn@cityresolve.local', name: 'Evelyn Reed', role: 'citizen', password: 'Citizen123!', points: 620, level: 5, badges: ['First Report', 'Civic Hero'] }),
    ensureUser({ email: 'aarav@cityresolve.local', name: 'Aarav Mehta', role: 'citizen', password: 'Citizen123!', points: 270, level: 2, badges: ['First Report'] }),
  ]);

  const citizens = [demoCitizen, ...moreCitizens];

  const existingCount = await Issue.countDocuments({});
  if (existingCount < 10) {
    await Issue.deleteMany({});
    await ActivityEvent.deleteMany({});
    await Comment.deleteMany({});
    await Vote.deleteMany({});
    await Notification.deleteMany({});

    const createdIssues = [];
    for (const [index, template] of issueTemplates.entries()) {
      const reporter = citizens[index % citizens.length];
      const createdAt = daysAgo(template.ageDays);
      const updatedAt = daysAgo(Math.max(template.ageDays - 1, 0));
      const issue = await Issue.create({
        reporterId: reporter._id,
        title: template.title,
        description: template.description,
        category: template.category,
        severity: template.severity,
        status: template.status,
        addressLabel: template.addressLabel,
        location: { type: 'Point', coordinates: [template.lng, template.lat] },
        upvoteCount: template.upvoteCount,
        commentCount: template.commentCount,
        progressPercent: template.progressPercent,
        createdAt,
        updatedAt,
      });
      createdIssues.push(issue);
    }

    const commentBodies = [
      'This needs urgent attention during school hours.',
      'The issue has been visible for several days now.',
      'Nearby residents confirmed the same problem this morning.',
      'Please assign the utilities team to inspect this area.',
    ];

    for (const [index, issue] of createdIssues.entries()) {
      const reporter = citizens[index % citizens.length];
      await ActivityEvent.create({
        type: 'reported',
        userId: reporter._id,
        targetIssueId: issue._id,
        title: `Reported "${issue.title}"`,
        locationLabel: issue.addressLabel,
        createdAt: issue.createdAt,
        updatedAt: issue.createdAt,
      });

      if (issue.status === 'inprogress') {
        await ActivityEvent.create({
          type: 'assigned',
          userId: admin._id,
          targetIssueId: issue._id,
          title: `Moved "${issue.title}" to In Progress`,
          locationLabel: issue.addressLabel,
          createdAt: daysAgo(Math.max(issueTemplates[index].ageDays - 1, 0)),
          updatedAt: daysAgo(Math.max(issueTemplates[index].ageDays - 1, 0)),
        });
      }

      if (issue.status === 'resolved') {
        await ActivityEvent.create({
          type: 'resolved',
          userId: admin._id,
          targetIssueId: issue._id,
          title: `Resolved "${issue.title}"`,
          locationLabel: issue.addressLabel,
          createdAt: issue.updatedAt,
          updatedAt: issue.updatedAt,
        });
      }

      for (let commentIndex = 0; commentIndex < issue.commentCount; commentIndex += 1) {
        const author = citizens[(index + commentIndex) % citizens.length];
        const createdAt = new Date(issue.createdAt.getTime() + (commentIndex + 1) * 3600 * 1000);
        await Comment.create({
          issueId: issue._id,
          authorId: author._id,
          body: commentBodies[(index + commentIndex) % commentBodies.length],
          createdAt,
          updatedAt: createdAt,
        });
      }

      for (let voteIndex = 0; voteIndex < issue.upvoteCount; voteIndex += 1) {
        const voter = citizens[voteIndex % citizens.length];
        const createdAt = new Date(issue.createdAt.getTime() + (voteIndex + 1) * 5400 * 1000);
        await Vote.create({
          issueId: issue._id,
          userId: voter._id,
          createdAt,
          updatedAt: createdAt,
        });
      }
    }

    await Notification.insertMany([
      {
        userId: demoCitizen._id,
        type: 'resolved',
        title: 'Issue Resolved',
        description: 'Your report about the Riverside Park branch has been resolved.',
      },
      {
        userId: demoCitizen._id,
        type: 'info',
        title: 'Points Awarded',
        description: 'You earned 50 points for a verified issue report.',
      },
    ]);
  }

  // eslint-disable-next-line no-console
  console.log('Seed complete. Demo accounts:');
  // eslint-disable-next-line no-console
  console.log('Admin:   admin@cityresolve.local / Admin123!');
  // eslint-disable-next-line no-console
  console.log('Citizen: citizen@cityresolve.local / Citizen123!');
  // eslint-disable-next-line no-console
  console.log(`MongoDB: ${config.mongodbUri}`);

  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
