/**
 * Placement Readiness Score Service (0 to 100)
 * Evaluates holistic placement readiness across 6 foundational pillars:
 * 1. Academic Performance (max 20)
 * 2. Profile Completeness (max 20)
 * 3. Resume & Portfolio (max 20)
 * 4. Verified Institutional Documents (max 15)
 * 5. Technical Skill Breadth (max 15)
 * 6. Placement Preparation & Activity (max 10)
 */

export class ReadinessScoreService {
  static calculate(student, documents = []) {
    const details = student?.studentDetails || {};

    // 1. Academic Pillar (max 20)
    let academicScore = 0;
    const cgpa = Number(details.cgpa || 0);
    if (cgpa >= 8.5) academicScore = 20;
    else if (cgpa >= 7.5) academicScore = 17;
    else if (cgpa >= 6.5) academicScore = 14;
    else academicScore = 10;
    if (Number(details.activeBacklogs || 0) > 0) academicScore = Math.max(0, academicScore - 8);

    // 2. Profile Completeness Pillar (max 20)
    let profileScore = 0;
    if (student?.name) profileScore += 4;
    if (student?.phone) profileScore += 4;
    if (details.branch && details.batch) profileScore += 4;
    if (details.githubUrl || details.linkedinUrl) profileScore += 4;
    if (details.projects && details.projects.length >= 1) profileScore += 4;

    // 3. Resume & Portfolio Pillar (max 20)
    let resumeScore = 0;
    if (details.resumeUrl) resumeScore += 10;
    if (details.resumeVerified) resumeScore += 5;
    if (details.projects && details.projects.length >= 2) resumeScore += 5;

    // 4. Documents Verified Pillar (max 15)
    let docScore = 0;
    const verifiedDocs = documents.filter((d) => d.status === 'VERIFIED');
    const docCount = verifiedDocs.length;
    if (docCount >= 3) docScore = 15;
    else if (docCount >= 1) docScore = 10;
    else if (documents.length > 0) docScore = 5;

    // 5. Technical Skills Pillar (max 15)
    let skillsScore = 0;
    const skillsCount = (details.skills || []).length;
    if (skillsCount >= 6) skillsScore = 15;
    else if (skillsCount >= 3) skillsScore = 10;
    else if (skillsCount >= 1) skillsScore = 5;

    // 6. Placement Preparation Pillar (max 10)
    let prepScore = 0;
    if (details.certifications && details.certifications.length > 0) prepScore += 5;
    if (Number(details.attendancePercentage || 0) >= 80) prepScore += 5;

    const totalScore = Math.min(100, academicScore + profileScore + resumeScore + docScore + skillsScore + prepScore);

    // Generate actionable improvement suggestions
    const nextActions = [];
    if (!details.resumeVerified) {
      nextActions.push({
        title: 'Upload / Verify Latest Resume',
        gain: '+5 pts',
        priority: 'HIGH',
      });
    }
    if ((details.projects || []).length < 2) {
      nextActions.push({
        title: 'Add 2 verified portfolio projects with GitHub repositories',
        gain: '+5 pts',
        priority: 'MEDIUM',
      });
    }
    if (docCount < 3) {
      nextActions.push({
        title: 'Upload pending marksheet & ID documents for TNP approval',
        gain: '+5 pts',
        priority: 'HIGH',
      });
    }
    if (skillsCount < 6) {
      nextActions.push({
        title: 'Add more core technical skills (e.g. System Design, Cloud, SQL)',
        gain: '+5 pts',
        priority: 'MEDIUM',
      });
    }
    if ((details.certifications || []).length === 0) {
      nextActions.push({
        title: 'Complete and upload a recognized technical certification',
        gain: '+5 pts',
        priority: 'LOW',
      });
    }

    return {
      totalScore,
      rating: totalScore >= 80 ? 'Placement Ready' : totalScore >= 60 ? 'Good Readiness' : 'Needs Preparation',
      breakdown: [
        { label: 'Academic Standing', score: academicScore, max: 20 },
        { label: 'Profile Completeness', score: profileScore, max: 20 },
        { label: 'Resume & Portfolio', score: resumeScore, max: 20 },
        { label: 'Verified Documents', score: docScore, max: 15 },
        { label: 'Technical Skills', score: skillsScore, max: 15 },
        { label: 'Preparation & Attendance', score: prepScore, max: 10 },
      ],
      nextActions,
      calculatedAt: new Date().toISOString(),
    };
  }
}
