# Verification & Testing Guide

## 1. Automated Verification Commands

### Frontend Production Build Test
To verify zero TypeScript errors, clean JSX compiling, and asset packaging:
```bash
cd frontend
npm run build
```
*Expected Result:* `tsc -b && vite build` completes with exit code 0 and bundles client assets in `dist/`.

### Backend API Verification Suite
Run the built-in automated test script against the active Express server and local MongoDB:
```bash
cd backend
node -e "
const fetch = globalThis.fetch;
async function verify() {
  const headers = (role) => ({ 'x-acting-role': role });

  // 1. TNP Dashboard
  let res = await fetch('http://localhost:5000/api/tnp/dashboard', { headers: headers('TNP') });
  let data = await res.json();
  console.log('✓ TNP Dashboard Status:', res.status, 'Total Students:', data.data?.kpis?.totalStudents);

  // 2. TNP Company Requests
  res = await fetch('http://localhost:5000/api/tnp/company-requests', { headers: headers('TNP') });
  data = await res.json();
  console.log('✓ TNP Company Requests Status:', res.status, 'Count:', data.data?.length);

  // 3. Student Recommendations
  res = await fetch('http://localhost:5000/api/student/recommendations', { headers: headers('STUDENT') });
  data = await res.json();
  console.log('✓ Student Recommendations Status:', res.status, 'High Fit Count:', data.data?.recommended?.length);

  // 4. Student Readiness 6-Pillar Score
  res = await fetch('http://localhost:5000/api/student/readiness', { headers: headers('STUDENT') });
  data = await res.json();
  console.log('✓ Readiness Score Status:', res.status, 'Score:', data.data?.totalScore, '/ 100');

  // 5. Company Recruiter Dashboard
  res = await fetch('http://localhost:5000/api/company/dashboard', { headers: headers('COMPANY') });
  data = await res.json();
  console.log('✓ Company Dashboard Status:', res.status, 'Active Drives:', data.data?.metrics?.activeDrives);
}
verify().catch(console.error);
"
```

---

## 2. Interactive Multi-Portal Demonstration
1. Open web application at `http://localhost:5173/`.
2. Notice the top header **Segmented Role Switcher**:
   - Click `🎓 Student`: Navigates to student placement views (Smart Matches, 6-Pillar Readiness, Verified Docs, Offers).
   - Click `🏛️ TNP Cell`: Instantly loads administrative command center, drive requests review, student academic overrides, document approvals, and audit logs.
   - Click `🏢 Company`: Switches to recruiter portal to post new campus drives, define cutoff criteria, and review candidate applicant pipelines.
3. Everything interacts live with MongoDB on `mongodb://127.0.0.1:27017/tnp_database`.
