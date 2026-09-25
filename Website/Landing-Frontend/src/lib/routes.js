// Client-only routes registered in App.jsx that have no server-side data of
// their own — auth forms, the logged-in profile/subscription pages, and
// account deletion. server.js serves the plain SPA shell for these with a
// 200 (same as any route App.jsx actually knows how to render), same
// reasoning as the comment on its catch-all route. Imported by both
// server.js and App.jsx so the two can't drift out of sync with each other
// — add a new client-only page here first, then use the constant in both
// places.
export const CLIENT_ONLY_ROUTES = {
  employeeProfile: '/employees/profile',
  employeeSubscription: '/employees/subscription',
  employeeSignup: '/employees/signup',
  employeeSignin: '/employees/signin',
  employeeForgotPassword: '/employees/forgot-password',
  employeeResetPassword: '/employees/reset-password',
  deleteAccount: '/delete-account',
  employerSignup: '/employers/signup',
  employerSignin: '/employers/signin',
  employerForgotPassword: '/employers/forgot-password',
  employerResetPassword: '/employers/reset-password',
  campusMantri: '/campus-mantri',
}
