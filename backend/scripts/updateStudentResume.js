import mongoose from 'mongoose';

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tnp_database');
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  
  const res = await User.updateOne(
    { email: '231cs001.faizaan@giet.edu' },
    {
      $set: {
        'studentDetails.willingToRelocate': true,
        'studentDetails.willingToTravel': true,
        'studentDetails.preferredWorkMode': 'Flexible (Hybrid / On-site / Remote)',
        'studentDetails.hobbies': [
          'Traveling & Exploring New Places',
          'Open Source Contributing',
          'Competitive Programming & DSA',
          'Tech Blogging',
          'Photography'
        ],
        'studentDetails.languages': [
          'English (Professional Working)',
          'Hindi (Native / Full Professional)',
          'Odia (Conversational)'
        ],
        'studentDetails.careerObjective': 'Passionate and detail-oriented Computer Science undergraduate with a strong foundation in full-stack web development, distributed systems, and data structures. Eager to contribute to high-impact software engineering teams at leading technology organizations with high adaptability, cultural curiosity, and zeal to learn.',
        'studentDetails.experience': [
          {
            role: 'Software Engineering Intern',
            company: 'Cognitive Labs',
            duration: 'May 2024 - July 2024',
            description: 'Engineered high-throughput REST APIs, optimized database indexes, and reduced query latency by 32%. Automated continuous deployment pipelines using GitHub Actions & Docker containers.'
          }
        ],
        'studentDetails.projects': [
          {
            title: 'Placement Management System (PMS)',
            description: 'Unified campus placement portal built with MERN stack, automated criteria validation, multi-role ecosystem, and live drive orchestration.',
            techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
            link: 'https://github.com/its5zoo/PLACEMENT-MANAGEMENT-SYSTEM'
          },
          {
            title: 'Distributed Event Streaming Engine',
            description: 'High-throughput fault-tolerant message streaming pipeline handling 50k+ events/sec with concurrent worker pools and telemetry dashboards.',
            techStack: ['Go', 'Docker', 'Redis', 'Kafka'],
            link: 'https://github.com/its5zoo'
          },
          {
            title: 'AI Resume Gap Analyzer',
            description: 'Intelligent skill extraction and alignment engine that cross-checks student credentials against dynamic recruiter requirements.',
            techStack: ['Python', 'FastAPI', 'Scikit-learn'],
            link: 'https://github.com/its5zoo'
          }
        ],
        'studentDetails.githubUrl': 'https://github.com/its5zoo',
        'studentDetails.linkedinUrl': 'https://linkedin.com/in/faizaan-khan',
        'studentDetails.portfolioUrl': 'https://faizaan.dev'
      }
    }
  );
  console.log('Faizaan resume details updated:', res.modifiedCount);
  await mongoose.disconnect();
}

main().catch(console.error);

