/**
 * Deterministic Explainable Eligibility Engine
 * Evaluates a student's institutional record against a drive's specific criteria.
 */

export class EligibilityEngine {
  static evaluate(student, drive) {
    const studentAcademics = student?.studentDetails || {};
    const criteria = drive?.eligibility || {};

    const passedChecks = [];
    const failedChecks = [];
    const missingRequirements = [];
    let scoreWeight = 0;
    let scoreAchieved = 0;

    // 1. CGPA Check
    const minCgpa = criteria.minCgpa ?? 6.5;
    const studentCgpa = Number(studentAcademics.cgpa ?? 0);
    scoreWeight += 25;
    if (studentCgpa >= minCgpa) {
      passedChecks.push(`CGPA: ${studentCgpa.toFixed(2)} meets minimum requirement of ${minCgpa.toFixed(2)}`);
      scoreAchieved += 25;
    } else {
      failedChecks.push(`Required CGPA: ${minCgpa.toFixed(2)} | Your CGPA: ${studentCgpa.toFixed(2)} (Deficit: ${(minCgpa - studentCgpa).toFixed(2)})`);
    }

    // 2. Active Backlogs Check
    const maxActiveBacklogs = criteria.maxActiveBacklogs ?? 0;
    const studentBacklogs = Number(studentAcademics.activeBacklogs ?? 0);
    scoreWeight += 20;
    if (studentBacklogs <= maxActiveBacklogs) {
      passedChecks.push(`Active Backlogs: ${studentBacklogs} (Permitted: <= ${maxActiveBacklogs})`);
      scoreAchieved += 20;
    } else {
      failedChecks.push(`Active Backlogs exceed limit: ${studentBacklogs} active backlogs (Company permits max: ${maxActiveBacklogs})`);
    }

    // 3. Attendance Percentage Check
    const minAttendance = criteria.minAttendance ?? 75.0;
    const studentAttendance = Number(studentAcademics.attendancePercentage ?? 85.0);
    scoreWeight += 15;
    if (studentAttendance >= minAttendance) {
      passedChecks.push(`Attendance: ${studentAttendance.toFixed(1)}% meets minimum requirement of ${minAttendance.toFixed(1)}%`);
      scoreAchieved += 15;
    } else {
      failedChecks.push(`Required Attendance: ${minAttendance.toFixed(1)}% | Your Attendance: ${studentAttendance.toFixed(1)}%`);
    }

    // 4. Branch / Discipline Check
    const allowedBranches = criteria.allowedBranches || [];
    const studentBranch = (studentAcademics.branch || '').toUpperCase();
    scoreWeight += 20;
    if (allowedBranches.length === 0 || allowedBranches.map(b => b.toUpperCase()).includes(studentBranch) || allowedBranches.includes('ALL')) {
      passedChecks.push(`Branch: ${studentBranch || 'General'} is an eligible discipline`);
      scoreAchieved += 20;
    } else {
      failedChecks.push(`Branch: ${studentBranch} is not in eligible branches (${allowedBranches.join(', ')})`);
    }

    // 5. 10th & 12th Percentage Checks
    const min10th = criteria.min10thPercentage ?? 60.0;
    const student10th = Number(studentAcademics.tenthPercentage ?? 75.0);
    if (student10th < min10th) {
      failedChecks.push(`10th Grade Percentage: ${student10th}% (Required: ${min10th}%)`);
    } else {
      passedChecks.push(`10th Grade: ${student10th}% >= ${min10th}%`);
    }

    const min12th = criteria.min12thPercentage ?? 60.0;
    const student12th = Number(studentAcademics.twelfthPercentage ?? 75.0);
    if (student12th < min12th) {
      failedChecks.push(`12th Grade Percentage: ${student12th}% (Required: ${min12th}%)`);
    } else {
      passedChecks.push(`12th Grade: ${student12th}% >= ${min12th}%`);
    }

    // 6. Graduation Year Check
    const allowedGradYears = criteria.allowedGraduationYears || [];
    const studentGradYear = Number(studentAcademics.graduationYear ?? 2027);
    if (allowedGradYears.length > 0 && !allowedGradYears.includes(studentGradYear)) {
      failedChecks.push(`Graduation Year: Batch ${studentGradYear} is not eligible (Required: ${allowedGradYears.join(', ')})`);
    } else {
      passedChecks.push(`Batch Year: ${studentGradYear} is eligible`);
    }

    // 7. Skills Match
    const requiredSkills = criteria.requiredSkills || [];
    const studentSkills = (studentAcademics.skills || []).map(s => s.toLowerCase());
    const matchedSkills = [];
    scoreWeight += 20;

    let skillScore = 0;
    if (requiredSkills.length > 0) {
      requiredSkills.forEach(req => {
        if (studentSkills.includes(req.toLowerCase())) {
          matchedSkills.push(req);
          skillScore += 20 / requiredSkills.length;
        } else {
          missingRequirements.push(`Missing Required Skill: ${req}`);
        }
      });
      scoreAchieved += skillScore;
    } else {
      scoreAchieved += 20;
    }

    // Overall Eligibility
    const isEligible = failedChecks.length === 0;
    const matchPercentage = Math.min(100, Math.round((scoreAchieved / scoreWeight) * 100));

    return {
      isEligible,
      matchPercentage,
      passedChecks,
      failedChecks,
      missingRequirements,
      matchedSkills,
      summary: isEligible
        ? 'You meet all mandatory academic, attendance, and branch criteria.'
        : `You are currently ineligible due to ${failedChecks.length} requirement(s).`,
      timestamp: new Date().toISOString(),
    };
  }
}
