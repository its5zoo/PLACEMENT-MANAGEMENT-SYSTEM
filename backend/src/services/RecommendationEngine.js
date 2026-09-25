import { EligibilityEngine } from './EligibilityEngine.js';

export class RecommendationEngine {
  static getRecommendations(student, drives) {
    const recommended = [];
    const eligible = [];
    const nearMatch = [];
    const notEligible = [];

    drives.forEach((drive) => {
      const evaluation = EligibilityEngine.evaluate(student, drive);

      const driveRecommendation = {
        driveId: drive._id,
        drive,
        matchPercentage: evaluation.matchPercentage,
        isEligible: evaluation.isEligible,
        passedChecks: evaluation.passedChecks,
        failedChecks: evaluation.failedChecks,
        missingRequirements: evaluation.missingRequirements,
        matchedSkills: evaluation.matchedSkills,
        explanation: evaluation.summary,
      };

      if (evaluation.isEligible) {
        if (evaluation.matchPercentage >= 80) {
          recommended.push({
            ...driveRecommendation,
            recommendationBadge: 'Top Match (High Fit)',
            recommendationReason: `Branch ${student?.studentDetails?.branch || 'CSE'} matches, CGPA ${(student?.studentDetails?.cgpa || 0).toFixed(2)} exceeds requirements, and ${evaluation.matchedSkills.length} required skill(s) verified.`,
          });
        } else {
          eligible.push(driveRecommendation);
        }
      } else {
        // Check if it's a near match (e.g. only missing skill or minor percentage gap, no hard backlogs issue)
        if (evaluation.matchPercentage >= 65 && evaluation.failedChecks.length <= 1) {
          nearMatch.push({
            ...driveRecommendation,
            nearMatchReason: evaluation.missingRequirements.length > 0
              ? evaluation.missingRequirements.join(', ')
              : evaluation.failedChecks[0] || 'Minor requirement shortfall',
          });
        } else {
          notEligible.push(driveRecommendation);
        }
      }
    });

    // Sort by match percentage descending
    recommended.sort((a, b) => b.matchPercentage - a.matchPercentage);
    eligible.sort((a, b) => b.matchPercentage - a.matchPercentage);
    nearMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
      recommended,
      eligible,
      nearMatch,
      notEligible,
      summary: {
        totalDrives: drives.length,
        recommendedCount: recommended.length,
        eligibleCount: eligible.length + recommended.length,
        nearMatchCount: nearMatch.length,
        notEligibleCount: notEligible.length,
      },
    };
  }
}
