import mongoose from 'mongoose';

const placementPolicySchema = new mongoose.Schema(
  {
    institutionName: { type: String, default: 'GIET University' },
    institutionDomain: { type: String, default: 'giet.edu' },
    minCgpaForPlacement: { type: Number, default: 6.5 },
    minAttendanceForPlacement: { type: Number, default: 75.0 },
    maxActiveBacklogsAllowed: { type: Number, default: 0 },
    allowMultipleApplications: { type: Boolean, default: true },
    allowMultipleOffers: { type: Boolean, default: true },
    allowOfferUpgrade: { type: Boolean, default: true },
    minPackageMultiplierForUpgrade: { type: Number, default: 1.3 }, // Must be 30% higher
    placementFreezeOnAcceptance: { type: Boolean, default: true },
    companyVerificationRequired: { type: Boolean, default: true },
    mandatoryDocuments: {
      type: [String],
      default: ['Resume', '10th Marksheet', '12th Marksheet', 'Semester Marksheet'],
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const PlacementPolicy = mongoose.model('PlacementPolicy', placementPolicySchema);
