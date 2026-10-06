import { Link } from 'react-router-dom'
import LegalPage from '../components/legal/LegalPage'

const LAST_UPDATED = 'October 6, 2026'
const PRIVACY_EMAIL = 'support@mzobs.com'

const linkCls = 'text-(--explorer-blue) font-bold hover:underline'
const boxCls = 'rounded-2xl border border-(--explorer-border) bg-white p-5 text-[15.5px] text-(--explorer-navy)/75 font-medium leading-relaxed'
const strongCls = 'font-black text-(--explorer-navy)'

const DATA_CATEGORIES = [
  ['Account information', 'Name, email, phone, user ID', 'Account creation and authentication'],
  ['Professional information', 'Skills, education, experience, CTC, notice period', 'Recruitment'],
  ['Resume/documents', 'CV, employment documents', 'Job applications and employer review'],
  ['Application information', 'Jobs applied for, status', 'Recruitment workflow'],
  ['Employer information', 'Company, recruiter and team-member information', 'Employer services'],
  ['Communication data', 'Messages, support requests', 'Communication and support'],
  ['Location', 'Approximate/precise device location when permission is granted', 'Near Me / job discovery'],
  ['Profile visibility and employer access', 'Open-to-opportunities setting, records of employers opening resumes or contact details', 'Employer search, audit and abuse prevention'],
  ['Employer outreach', 'Emails/SMS sent to candidates through the portal', 'Recruitment communication and audit'],
  ['Forms and enquiries', 'Contact, associate and “Customize plan” submissions', 'Responding and follow-up'],
  ['Payment information', 'Order ID, payment ID, amount, status', 'Payment processing and records'],
  ['Notification information', 'Push token', 'Notifications'],
  ['Technical information', 'Application/session/security information', 'Security and service functionality'],
  ['Authentication data', 'Google authentication information, hashed passwords', 'Account security'],
  ['Transaction records', 'Payment and subscription records', 'Accounting, security, and service delivery'],
]

const SECTIONS = [
  {
    title: 'Scope of this Privacy Policy',
    blocks: [
      { p: 'This Privacy Policy applies to information processed through:' },
      {
        ul: [
          'The Mzobs mobile applications, including the Mzobs candidate app and the Mzobs Employer app',
          'The Mzobs website and web application',
          'Mzobs candidate and employer portals',
          'Forms on our website, such as the contact, “Customize plan” and associate forms',
          'Mzobs APIs and backend services',
          'Job applications, recruitment and hiring workflows',
          'Communications and support services associated with Mzobs',
          'Payment and subscription services provided through Mzobs',
        ],
      },
      {
        p: 'This Privacy Policy does not govern third-party websites, applications, payment pages, or services that are independently operated by third parties. Those services may have their own privacy policies.',
      },
    ],
  },
  {
    title: 'Information we collect',
    blocks: [
      {
        p: 'We collect information that you voluntarily provide, information generated through your use of the Services, and limited information received from third-party authentication and service providers. The information we process depends on whether you use Mzobs as a candidate, employer, recruiter, visitor, or other user.',
      },
      { h: 'Account and authentication information' },
      { p: 'When you create or access a Mzobs account, we may collect:' },
      {
        ul: [
          'Full name, email address and phone number',
          'User/account identifier',
          'Password information in securely hashed form',
          'Authentication and session information',
          'Google account information when you choose Google Sign-In',
          'Verification information associated with account authentication',
        ],
      },
      {
        p: 'Passwords are not stored in plain text. Passwords are securely hashed before storage. For phone verification, Mzobs uses an external SMS service provider to deliver one-time passwords (OTPs). Mzobs does not intentionally store the OTP itself as a user’s password or account credential.',
      },
    ],
  },
  {
    title: 'Candidate information',
    blocks: [
      { p: 'If you use Mzobs as a candidate/job seeker, you may provide information including:' },
      { h: 'Personal information' },
      {
        ul: [
          'Name, email address and phone number',
          'City, state and pincode',
          'Profile and professional profile information',
          'Other information that you choose to add to your profile',
        ],
      },
      { h: 'Professional information' },
      {
        ul: [
          'Skills, education and qualifications',
          'Employment history, previous employers, job titles/designations and work experience',
          'Notice period, current compensation/CTC and expected compensation',
          'Resume headline and professional summary',
          'LinkedIn profile, GitHub profile and portfolio links',
          'Resume/CV and other job-search or professional information',
        ],
      },
      { h: 'Additional profile information' },
      {
        p: 'Certain profile fields may be available through Mzobs web-based services depending on the profile functionality enabled for your account. These may include information such as date of birth, gender, or marital status where voluntarily provided.',
      },
      {
        p: 'You should only provide information that is relevant to your job-search or professional profile and that you are comfortable sharing with prospective employers.',
      },
    ],
  },
  {
    title: 'Resumes and documents',
    blocks: [
      {
        p: 'If you upload a resume or other supported employment document, Mzobs may collect and process that document for purposes including:',
      },
      {
        ul: [
          'Creating and maintaining your candidate profile',
          'Enabling you to apply for jobs',
          'Allowing authorized employers to review your application',
          'Facilitating recruitment and hiring',
          'Providing document access within the Services',
          'Maintaining recruitment records where necessary',
        ],
      },
      {
        p: 'Supported resume/document formats may include PDF, DOC, and DOCX, subject to the current limits and functionality of the Services. Resumes are stored in private cloud object storage operated through Amazon Web Services (AWS) S3. Mzobs uses access-controlled mechanisms, including authenticated access and time-limited access mechanisms, to provide authorized access to resumes.',
      },
      {
        p: 'The Mzobs team may review an uploaded resume to check that it is genuine and readable, and to mark it as verified. Verified resumes may be shown to employers as described under “Who can find your profile”.',
      },
      { p: 'You should not upload documents containing information that is unrelated to your employment application.' },
    ],
  },
  {
    title: 'Job applications and recruitment information',
    blocks: [
      { p: 'When you search for or apply to a job, Mzobs may process information associated with your application, including:' },
      {
        ul: [
          'Job applied for, candidate profile and resume',
          'Application status and application date/time',
          'Employer or recruiter associated with the job',
          'Interview information and hiring-related information',
          'Candidate-employer communications',
          'Other information necessary to facilitate the recruitment process',
        ],
      },
      {
        p: 'When you apply for a job, relevant candidate information may be made available to the employer or recruiter associated with that job. Employers are responsible for their own use of candidate information after receiving it through Mzobs and must comply with applicable laws and their own privacy obligations.',
      },
    ],
  },
  {
    title: 'Who can find your profile',
    blocks: [
      {
        p: 'Employers do not only see candidates who apply to their jobs. Employers with an active Mzobs plan can search the Mzobs candidate database by skills, experience, location, notice period and similar filters. Your profile can appear in those searches only when all of the following are true:',
      },
      {
        ul: [
          'Your account is active',
          'Your “open to opportunities” setting is switched on',
          'Your resume has been verified by Mzobs',
        ],
      },
      {
        p: 'In search results your email address, phone number and resume are hidden. An employer can reveal them only by spending a CV credit on your profile, one item at a time, and each time an employer opens your resume or private contact details Mzobs records it in an access log. Employers can also email or SMS candidates from the Mzobs portal; those messages are logged and limited in number per candidate.',
      },
      {
        p: 'You can stop appearing in employer searches at any time by turning off “open to opportunities” in your profile settings. This does not remove applications you have already sent to employers.',
      },
    ],
  },
  {
    title: 'Candidate subscription and premium services',
    blocks: [
      {
        p: 'Some candidate features are paid. If you buy the candidate subscription or request a premium service (for example a human-assisted service or a mock interview), we process the details of your request, any date or time you choose, the status of the request, payment details (see “Payment information”) and the summary or material we deliver to you. Requests are handled by the Mzobs operations team, who can see these details so that they can carry out the service.',
      },
    ],
  },
  {
    title: 'Employer information',
    blocks: [
      { p: 'If you use Mzobs as an employer, recruiter, or organization representative, we may collect:' },
      {
        ul: [
          'Name, business email and phone number',
          'Company/organization name and company information',
          'Job role/designation and employer profile information',
          'Job postings and hiring requirements',
          'Candidate interaction information and interview and hiring information',
          'Payment and subscription information, including the employer plan you choose and CV credits you buy or use',
          'Details you submit through a “Customize plan” enquiry (name, company name, phone number and email)',
          'Details of colleagues you add to your company account (name, email, role) and the actions they take on the account',
          'Candidates whose contact details or resumes you unlock, view or download',
          'Other information voluntarily provided in connection with employer services',
        ],
      },
      { p: 'Employers may also provide information about their organization for verification and hiring purposes.' },
    ],
  },
  {
    title: 'Employer plans, CV credits and plan enquiries',
    blocks: [
      { p: 'Employers can subscribe to an annual employer plan on the Mzobs website or in the Mzobs Employer app, and may use CV credits to unlock candidate contact details. In connection with this we may process:' },
      {
        ul: [
          'The plan you select, its price, GST and invoice details, validity dates and renewal status',
          'CV credit purchases, balances and the candidates you unlock, so that credits are charged correctly and your usage history can be shown to you',
          'Your mobile number, where you subscribe without first creating an account, so that an employer account can be created for you and you can be contacted about it',
        ],
      },
      { p: 'If you choose “Customize plan” on the website or in the Mzobs Employer app, we collect the name, company name, phone number and email address you enter in the form, and note whether the request came from the website or the app.' },
      { p: 'This information is shared with the Mzobs operations team, who use it only to contact you about a suitable plan, give you a quote and follow up on your request. We do not use it to publish anything about you or to sell it to third parties. You may ask us to delete an enquiry by writing to the contact address below.' },
    ],
  },
  {
    title: 'Job postings and employer verification',
    blocks: [
      {
        p: 'Mzobs may process information relating to companies, employers, recruiters, and job postings to support platform verification, fraud prevention, recruitment integrity, and platform safety. This may include company details, contact information, job descriptions, hiring requirements, verification information, employer account information, job posting history, and information relating to interactions with candidates.',
      },
      { p: 'Mzobs may use this information to help maintain the integrity and reliability of the recruitment platform.' },
    ],
  },
  {
    title: 'Communications and messages',
    blocks: [
      { p: 'Mzobs may provide communication functionality between candidates and employers/recruiters. If you use these features, we may process:' },
      {
        ul: [
          'Messages and conversation information',
          'Sender and recipient identifiers',
          'Message timestamps and notification information',
          'Other information necessary to deliver and maintain communications',
          'For emails and SMS that employers send to candidates from the portal: the channel, subject, full text, delivery status and any delivery error',
        ],
      },
      {
        p: 'Messages may be accessible to the intended participants and may be processed for platform functionality, security, abuse prevention, dispute handling, and support. You should not send sensitive personal information through Mzobs messaging unless it is necessary for the recruitment process.',
      },
    ],
  },
  {
    title: 'AI-assisted candidate search',
    blocks: [
      {
        p: 'The employer portal and the Mzobs Employer app can turn a plain-English search or a pasted job description into search filters. When an employer uses this feature, the text they type or paste is sent to our AI service provider, Groq, which returns the filters. We do not send candidate profiles, resumes or contact details to the AI provider for this feature, and the result is used only to run the search. Employers should not paste personal information about individuals into the search box.',
      },
    ],
  },
  {
    title: 'Support, contact and partnership forms',
    blocks: [
      { p: 'When you contact Mzobs support, use the contact form, or submit a form such as “Associate with Mzobs” or “Customize plan”, we may collect:' },
      {
        ul: [
          'Name, email address and phone number',
          'Account information and support request details',
          'For the contact form: your role (job seeker, employer or other), subject and message',
          'For the associate form: company name, contact person, city, website and a description of the company',
          'For the “Customize plan” form: company name and whether the request came from the website or the app',
          'Attachments or information voluntarily submitted with the request',
          'Communications between you and Mzobs',
          'Technical information necessary to investigate the issue',
        ],
      },
      { p: 'We use this information to respond to your request, follow up with a quote or partnership discussion, investigate technical issues, resolve complaints, prevent abuse, maintain service quality, and protect the security of the platform.' },
    ],
  },
  {
    title: 'Location information',
    blocks: [
      { p: 'Mzobs may request access to your device’s location when you use features that provide location-based job discovery, such as “Near Me”. Location access is:' },
      {
        ul: [
          'Optional',
          'Used only when the relevant feature requires it',
          'Requested through the Android permission system',
          'Used through foreground/while-in-use access',
          'Not used for continuous background tracking',
          'Not used to continuously monitor your location',
        ],
      },
      {
        p: 'Depending on your device and permission settings, Android may provide approximate or precise location information. Mzobs currently uses location functionality to help identify jobs or opportunities near the user’s selected/current area, and does not intentionally maintain a continuous history of your device location for this feature.',
      },
      {
        p: 'If you deny location permission, you may continue using other parts of the Services, although location-dependent functionality may be unavailable or less accurate.',
      },
    ],
  },
  {
    title: 'Device and technical information',
    blocks: [
      { p: 'When you use Mzobs, certain technical information may be processed automatically or generated as part of providing the Services. This may include:' },
      {
        ul: [
          'Device/application information required for app functionality',
          'Authentication/session information',
          'Network/API request information',
          'Push notification token and application version',
          'Operating-system-related information necessary for compatibility',
          'Security and diagnostic information generated by the platform infrastructure',
        ],
      },
      {
        p: 'Mzobs does not intentionally collect advertising identifiers for advertising purposes through the current Mzobs application. Mzobs does not use the device microphone, camera, contacts, calendar, or health data for the Services described in this Privacy Policy.',
      },
    ],
  },
  {
    title: 'Push notifications',
    blocks: [
      { p: 'If you permit notifications, Mzobs may process a push notification token associated with your device to send service-related notifications. Notifications may include:' },
      {
        ul: [
          'Job/application updates and interview notifications',
          'Employer/candidate activity',
          'Account-related alerts and security notifications',
          'Service announcements and other notifications related to your use of Mzobs',
        ],
      },
      {
        p: 'Push notifications may be delivered through third-party notification infrastructure, including Expo Push Service and Firebase Cloud Messaging (FCM). The Mzobs website may also offer browser (web) push notifications if you allow them in your browser. You can manage notification permissions through your device or browser settings, and switch off categories of notifications in your Mzobs notification preferences where offered.',
      },
    ],
  },
  {
    title: 'Email communications',
    blocks: [
      { p: 'Mzobs may send emails for purposes including:' },
      {
        ul: [
          'Account verification, password reset and account security',
          'Job/application notifications',
          'Employer/candidate communications',
          'Transactional notifications and support responses',
          'Important service updates',
        ],
      },
      {
        p: 'Email delivery may be facilitated through third-party email/SMTP service providers. These providers may process email addresses and message information solely as necessary to provide email delivery services.',
      },
    ],
  },
  {
    title: 'SMS and OTP services',
    blocks: [
      {
        p: 'Mzobs uses MSG91 or its applicable SMS service infrastructure to deliver phone verification OTPs and transactional communications. For OTP verification, your phone number may be transmitted to the SMS provider for delivery of the verification message. The SMS provider processes the phone number and message information necessary to provide the service.',
      },
      { p: 'Mzobs does not use OTP delivery information for unrelated advertising purposes.' },
    ],
  },
  {
    title: 'Google Sign-In',
    blocks: [
      { p: 'Mzobs may allow you to create or access your account using Google Sign-In. If you choose Google authentication, Mzobs may receive information made available through the authentication process, which may include:' },
      {
        ul: [
          'Name and email address',
          'Google account identifier',
          'Authentication information necessary to establish your Mzobs account',
        ],
      },
      {
        p: 'Google authentication is optional. You may use other available authentication methods where offered. Google’s own privacy practices apply to information that Google processes independently of Mzobs.',
      },
    ],
  },
  {
    title: 'Payment information',
    blocks: [
      { p: 'Certain Mzobs services, particularly employer/subscription services, may require payment. Mzobs uses Razorpay as a payment service provider. Mzobs may process or store information such as:' },
      {
        ul: [
          'Order ID, payment ID, amount and currency',
          'Payment status and payment purpose',
          'Transaction timestamps and receipt/reference information',
          'Customer name, email and phone number',
        ],
      },
      {
        p: 'Payment card numbers, CVV information, UPI credentials, and bank account credentials are processed through the payment provider’s payment infrastructure and are not intentionally stored by Mzobs as part of its own application database. Razorpay may independently process payment information according to its own terms and privacy practices.',
      },
      {
        p: 'Mzobs may retain transaction records where necessary for accounting, taxation, fraud prevention, dispute resolution, legal compliance, or legitimate business purposes.',
      },
    ],
  },
  {
    title: 'How we use information',
    blocks: [
      { h: 'Providing the Services' },
      {
        ul: [
          'Creating and managing accounts, and maintaining candidate and employer profiles',
          'Providing job discovery and enabling job applications',
          'Facilitating recruitment and providing employer hiring functionality',
          'Delivering resumes to authorized employers',
          'Enabling candidate-employer communication and providing notifications',
          'Providing support and processing payments',
        ],
      },
      { h: 'Security and fraud prevention' },
      {
        ul: [
          'Verifying and protecting accounts',
          'Detecting suspicious activity and preventing unauthorized access',
          'Preventing fraud and abuse, and protecting users and the platform',
          'Investigating security incidents and enforcing platform rules',
        ],
      },
      { h: 'Platform improvement' },
      {
        ul: [
          'Maintaining and improving functionality',
          'Troubleshooting technical problems and understanding service usage',
          'Improving recruitment workflows and platform reliability',
          'Developing new features',
        ],
      },
      { h: 'Legal and compliance purposes' },
      {
        ul: [
          'Complying with applicable law and responding to lawful requests',
          'Maintaining required business records',
          'Resolving disputes, enforcing agreements and protecting legal rights',
          'Meeting accounting, tax, regulatory, and security requirements',
        ],
      },
    ],
  },
  {
    title: 'When we share information',
    blocks: [
      { p: 'Mzobs does not sell your personal information as a commercial product. We may share or disclose information in the following circumstances.' },
      { h: 'With employers and recruiters' },
      {
        p: 'When you apply for a job or otherwise choose to participate in an employer recruitment process, relevant candidate information may be shared with the employer or recruiter. This may include your name, contact information where applicable, city/state/pincode, skills, education, work experience, employment information, compensation information where provided, professional links, resume, application information, interview information, and other profile information relevant to the recruitment process. You should review the information in your profile before applying for jobs.',
      },
      {
        p: 'Once an employer has received candidate information, the employer may independently process it for legitimate recruitment and employment purposes and may keep it in line with its own legal obligations and privacy policies. Mzobs does not control how an independent employer uses information after it has lawfully received it, except as required by our agreements, applicable law or platform controls.',
      },
      { h: 'With the Mzobs team' },
      {
        p: 'Mzobs staff, including our operations team, can access account, profile, resume, application, payment and request information to the extent needed for verification, support, premium services and platform safety. Staff access is limited to authorised team members.',
      },
      { h: 'With service providers' },
      {
        p: 'We may use trusted third-party service providers that process information on our behalf, including providers supporting cloud storage, database infrastructure, authentication, SMS/OTP delivery, payment processing, email delivery, push notifications, hosting, security, and other infrastructure required to operate Mzobs. These providers receive only the information reasonably necessary to provide their services.',
      },
      { h: 'Legal and safety disclosures' },
      {
        p: 'We may disclose information where reasonably necessary to comply with applicable law, respond to legal process, protect the rights, property, or safety of Mzobs, protect users or other persons, investigate fraud or security incidents, or enforce our agreements and policies.',
      },
    ],
  },
  {
    title: 'Third-party service providers',
    blocks: [
      { p: 'Mzobs may use third-party providers as part of its infrastructure and service delivery. These may include:' },
      {
        ul: [
          'Amazon Web Services (AWS S3): private storage of uploaded resumes and documents',
          'MongoDB / MongoDB Atlas: storing application, account, profile, job, communication, and related platform data',
          'Razorpay: payment processing and transaction-related services',
          'Groq: converting employers’ typed search text into search filters (AI-assisted search)',
          'MSG91: phone OTP and applicable transactional SMS delivery',
          'Google: Google authentication where a user chooses Google Sign-In',
          'Expo Push Service / Firebase Cloud Messaging: delivering push notifications',
          'Email/SMTP providers: delivering transactional and service-related emails',
        ],
      },
      { p: 'Third-party providers may have their own privacy policies and terms governing information they process.' },
    ],
  },
  {
    title: 'Data storage',
    blocks: [
      { p: 'Mzobs stores different categories of information using appropriate infrastructure based on the nature of the information.' },
      {
        ul: [
          'Candidate, employer, job, application, communication, and related application records may be stored in Mzobs’ database infrastructure, including MongoDB/MongoDB Atlas where applicable.',
          'Uploaded resumes and documents may be stored using private AWS S3 storage.',
          'Payment transaction records may be maintained within Mzobs systems and/or by the applicable payment provider as required for transaction processing and legitimate record-keeping.',
        ],
      },
    ],
  },
  {
    title: 'Data security',
    blocks: [
      { p: 'Mzobs takes reasonable technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, disclosure, or destruction. Security measures may include:' },
      {
        ul: [
          'HTTPS/TLS encrypted communication',
          'Secure authentication mechanisms and password hashing',
          'JWT-based authenticated access',
          'Secure device storage for applicable authentication/session information',
          'Role-based access controls and authorization checks',
          'Private cloud storage for resumes, time-limited file access mechanisms, and S3 server-side encryption where applicable',
          'Input validation and API security controls',
          'Rate limiting for sensitive operations',
          'Security headers and CORS controls',
          'Authentication and authorization middleware',
          'Protection against unauthorized file access and path traversal',
          'Payment webhook signature verification',
          'Monitoring and security procedures',
        ],
      },
      {
        p: 'Uploaded resumes are not intended to be publicly accessible. Mzobs uses authenticated and authorization-controlled mechanisms, including time-limited URLs and application authorization tokens, to provide access to resumes, and records when an employer opens a resume or private contact details. A resume is not publicly accessible merely because an authorized employer can open it. If you believe that your resume or another document has been accessed without authorization, contact us immediately.',
      },
      {
        p: 'No method of electronic storage or transmission is completely secure. Therefore, while we take reasonable measures to protect information, we cannot guarantee absolute security.',
      },
    ],
  },
  {
    title: 'Data retention',
    blocks: [
      {
        p: 'We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. Different categories of information may be retained for different periods.',
      },
      {
        ul: [
          'Account information: generally retained while your account remains active.',
          'Candidate profile information: may be retained while your account is active and as necessary to provide recruitment services.',
          'Resumes: may be retained while required for your profile, applications, recruitment activities, or other legitimate platform purposes.',
          'Applications: may be retained to provide application history, recruitment functionality, dispute resolution, security, and legitimate record-keeping.',
          'Messages: may be retained as necessary for communication functionality, security, dispute handling, abuse prevention, and legitimate operational purposes.',
          'Payment records: certain payment and transaction records may be retained after account deletion where necessary for taxation, accounting, fraud prevention, dispute resolution, legal compliance, or other legitimate obligations.',
          'Employer access and outreach records: records of which employer opened a resume or contact detail, and emails/SMS sent to candidates through the portal, may be kept for audit, abuse-prevention and dispute purposes.',
          'Forms and enquiries: contact, associate and “Customize plan” submissions are kept for as long as needed to respond and follow up, and for reasonable business records afterwards.',
          'Interview and offer records: certain recruitment records may be retained after account deletion where necessary for recruitment records, contractual, legal, dispute-resolution, security, or legitimate business purposes.',
        ],
      },
      {
        p: 'Where retention is required, Mzobs may limit access to such information and may anonymize or de-identify information where reasonably practicable.',
      },
    ],
  },
  {
    title: 'Account deletion',
    after: (
      <p className="text-[15.5px] text-(--explorer-navy)/75 font-medium">
        Use the{' '}
        <Link to="/delete-account" className={linkCls}>
          account deletion page
        </Link>{' '}
        to submit a request.
      </p>
    ),
    blocks: [
      { p: 'If you create a Mzobs account, you can request deletion of your account and associated personal information. Account deletion can be initiated:' },
      {
        ul: [
          'Through the account deletion functionality available within the Mzobs application or website; or',
          'Through the designated Mzobs account deletion web resource.',
        ],
      },
      {
        p: 'Upon a valid deletion request, Mzobs will delete or de-identify personal information associated with the account, subject to information that we are legally permitted or required to retain. Depending on the account type and information involved, deletion may include:',
      },
      {
        ul: [
          'Account/profile records and resume files',
          'Saved jobs and application-related user records',
          'Notifications, push notification tokens and user preferences',
          'Mock interview information and user support records where applicable',
          'Conversations and messages where applicable',
          'Other account-associated information that is not required to be retained',
        ],
      },
      { p: 'Certain records may be retained where necessary for:' },
      {
        ul: [
          'Tax/accounting requirements',
          'Fraud prevention and security',
          'Legal compliance and dispute resolution',
          'Contractual obligations or protection of legal rights',
        ],
      },
      { p: 'Where such information is retained, Mzobs will restrict its use to the purposes for which retention is necessary.' },
      {
        p: 'Employer accounts: to delete an employer account and its company data, write to us at the contact address below from the email registered on the account. We may ask you to verify your identity first. Subscription, invoice and payment records are retained as described above, and candidate information that you already received may remain with you under your own obligations as an employer.',
      },
    ],
  },
  {
    title: 'Deletion of resumes and documents',
    blocks: [
      {
        p: 'When an account deletion request is completed, resumes and associated documents stored in Mzobs-controlled storage are intended to be deleted, subject to legitimate retention requirements and technical backup cycles where applicable.',
      },
      {
        p: 'Deletion of information previously provided to employers or other independent third parties may be subject to those parties’ own retention obligations and policies. Where Mzobs relies on a service provider to process information on its behalf, Mzobs may request deletion of applicable information consistent with the service provider’s contractual and technical capabilities.',
      },
    ],
  },
  {
    title: 'Your rights and choices',
    blocks: [
      { p: 'Subject to applicable law, you can:' },
      {
        ul: [
          'Access and review the personal information in your account, and ask what we hold about you',
          'Correct or update information that is inaccurate or incomplete, through your account or by contacting support',
          'Ask us to delete your personal information or account (see “Account deletion”)',
          'Withdraw consent for optional processing, such as location, notifications or appearing in employer searches (“open to opportunities”)',
          'Opt out of non-essential notifications through device, browser or Mzobs notification settings',
          'Raise a complaint or grievance about how your information is handled',
        ],
      },
      {
        p: 'To use these rights, write to the contact address below. We may ask for reasonable verification before acting, so that your information is not changed or disclosed to the wrong person, and we may be unable to act on a request where the law requires us to keep the information.',
      },
    ],
  },
  {
    title: 'Cookies and similar technologies',
    blocks: [
      { p: 'The Mzobs website may use cookies and similar technologies where required for:' },
      {
        ul: [
          'Authentication and session management',
          'Security and preferences',
          'Website functionality, performance and service improvement',
        ],
      },
      {
        p: 'Cookies may be necessary for certain website functionality. You can manage cookies through your browser settings. Disabling certain cookies may affect website functionality. The Mzobs Android application does not rely on website cookies for its core mobile functionality.',
      },
    ],
  },
  {
    title: 'Data from children',
    blocks: [
      {
        p: 'Mzobs is a recruitment and employment platform and is not intended for anyone under 18 years of age. We do not knowingly request or intentionally collect personal information from children where prohibited by applicable law.',
      },
      {
        p: 'If you believe that a child has provided personal information to Mzobs without appropriate authorization, please contact us so that we can investigate and take appropriate action.',
      },
    ],
  },
  {
    title: 'Your responsibilities',
    blocks: [
      { p: 'You are responsible for:' },
      {
        ul: [
          'Providing accurate information and keeping your login credentials secure',
          'Reviewing information before submitting it',
          'Not uploading unnecessary sensitive information',
          'Not impersonating another person or using another person’s personal information without authorization',
          'Using candidate/employer information only for legitimate purposes',
          'Reporting suspected unauthorized access or misuse',
        ],
      },
    ],
  },
  {
    title: 'Employer responsibilities',
    blocks: [
      { p: 'Employers and recruiters using Mzobs must:' },
      {
        ul: [
          'Use candidate information only for legitimate recruitment purposes',
          'Protect candidate information they receive and avoid unauthorized disclosure',
          'Comply with applicable privacy and employment laws',
          'Not misuse resumes or contact information',
          'Not use candidate information for unrelated purposes without an appropriate legal basis or consent',
          'Follow applicable Mzobs terms and policies',
        ],
      },
    ],
  },
  {
    title: 'International and third-party processing',
    blocks: [
      {
        p: 'Some service providers used by Mzobs may process or store information in countries or locations outside your state or country. Where information is transferred to third-party infrastructure providers, Mzobs takes reasonable steps to use service providers with appropriate security and data protection practices. The privacy laws applicable to such processing may differ from those in your jurisdiction.',
      },
    ],
  },
  {
    title: 'Security incidents',
    blocks: [
      {
        p: 'If Mzobs becomes aware of a security incident affecting personal information, we may investigate the incident and take reasonable measures to contain, remediate, and prevent recurrence. Where required by applicable law, Mzobs may notify affected users, regulators, or other relevant parties.',
      },
    ],
  },
  {
    title: 'Third-party links and services',
    blocks: [
      {
        p: 'Mzobs may contain links to third-party websites, services, employer websites, job-related resources, or other external platforms. Mzobs is not responsible for the privacy practices of third parties that operate independently from Mzobs. You should review the privacy policy of any third-party service before providing information to it.',
      },
    ],
  },
  {
    title: 'Changes to this Privacy Policy',
    blocks: [
      { p: 'We may update this Privacy Policy from time to time to reflect:' },
      {
        ul: [
          'Changes to our Services, technology or data practices',
          'Changes to third-party service providers',
          'Changes in applicable law',
          'Other operational or security requirements',
        ],
      },
      {
        p: 'When we make material changes, we may update the “Last updated” date and provide additional notice where appropriate. Your continued use of the Services after an updated Privacy Policy becomes effective means that you acknowledge the updated policy.',
      },
    ],
  },
  {
    title: 'Contact us',
    after: (
      <div className={boxCls}>
        <p>
          <span className={strongCls}>Company:</span> Mesho Solutions
        </p>
        <p>
          <span className={strongCls}>Platform:</span> Mzobs
        </p>
        <p>
          <span className={strongCls}>Website:</span>{' '}
          <a href="https://mzobs.com" className={linkCls}>
            https://mzobs.com
          </a>
        </p>
        <p>
          <span className={strongCls}>Privacy/Support email:</span>{' '}
          <a href={`mailto:${PRIVACY_EMAIL}`} className={linkCls}>
            {PRIVACY_EMAIL}
          </a>
        </p>
        <p>
          <span className={strongCls}>Grievance Officer:</span> Grievance Officer, Mesho Solutions, at{' '}
          <a href={`mailto:${PRIVACY_EMAIL}`} className={linkCls}>
            {PRIVACY_EMAIL}
          </a>{' '}
          (write “Privacy grievance” in the subject line)
        </p>
        <p className="mt-3">
          We aim to acknowledge privacy requests and grievances promptly and to resolve them within the time required by
          applicable law.
        </p>
        <p className="mt-3">
          For account deletion requests, please use the account deletion mechanism available through the Mzobs
          website/application or contact the email address above. When contacting us regarding an account, we may
          request sufficient information to verify your identity and protect your account from unauthorized requests.
        </p>
      </div>
    ),
    blocks: [
      {
        p: 'If you have questions, concerns, complaints, or requests regarding this Privacy Policy or the handling of your personal information, contact us.',
      },
    ],
  },
  {
    title: 'Consent and acknowledgement',
    blocks: [
      {
        p: 'By using Mzobs, you acknowledge that you have read this Privacy Policy and understand how Mzobs processes information as described above.',
      },
      {
        p: 'We process personal information because you give it to us and ask us to provide the Services (for example, applying to a job or subscribing to a plan), because you have consented (for example, to location access, notifications or appearing in employer searches), because it is needed to keep the platform safe, or because the law requires it.',
      },
      {
        p: 'Where applicable law requires consent for a particular processing activity, Mzobs will seek the appropriate consent or provide the applicable choice mechanism. You may withdraw optional permissions through your device or account settings where supported. Withdrawal of a permission may affect functionality that depends on that permission.',
      },
    ],
  },
  {
    title: 'Governing law',
    blocks: [
      {
        p: 'This Privacy Policy is governed by the laws of India, including, to the extent applicable, the Information Technology Act, 2000 and the rules made under it and the Digital Personal Data Protection Act, 2023. It shall be interpreted in accordance with applicable laws and regulations. Nothing in this Privacy Policy is intended to limit any rights that you may have under applicable privacy, consumer protection, data protection, or other laws.',
      },
    ],
  },
  {
    title: 'Summary of major data categories',
    after: (
      <div className="overflow-x-auto rounded-2xl border border-(--explorer-border) bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="text-(--explorer-navy)">
            <tr>
              <th className="px-4 py-3 font-black">Data category</th>
              <th className="px-4 py-3 font-black">Examples</th>
              <th className="px-4 py-3 font-black">Primary purpose</th>
            </tr>
          </thead>
          <tbody className="text-(--explorer-navy)/75 font-medium">
            {DATA_CATEGORIES.map(([cat, ex, purpose]) => (
              <tr key={cat} className="border-t border-(--explorer-border) align-top">
                <td className="px-4 py-3 font-bold text-(--explorer-navy) whitespace-nowrap">{cat}</td>
                <td className="px-4 py-3">{ex}</td>
                <td className="px-4 py-3">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    blocks: [
      { p: 'For transparency, Mzobs may process the following categories of information depending on your use of the Services:' },
    ],
  },
  {
    title: 'Our privacy principle',
    blocks: [
      {
        p: 'Mzobs aims to collect and process information only to the extent reasonably necessary to provide, secure, improve, and operate its recruitment and employment services. We do not sell users’ personal information as a commercial product. Users should provide only information that is relevant and appropriate for the intended use of the Mzobs platform.',
      },
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <LegalPage
      seoPath="/privacy-policy"
      label="Privacy Policy"
      titleLead="How We Handle"
      titleAccent="Your Data"
      lastUpdated={LAST_UPDATED}
      seeAlso={{ to: '/terms-of-service', label: 'Terms & Conditions' }}
      sections={SECTIONS}
      intro={
        <>
          <p className="text-[17px] text-(--explorer-navy)/80 leading-relaxed font-medium">
            Mzobs is operated by <strong className="text-(--explorer-navy)">Mesho Solutions</strong> (&ldquo;Mzobs&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Mzobs provides a technology platform that connects
            job seekers/candidates with employers and recruiters, facilitates job discovery and applications, supports
            candidate and employer profiles, enables communication between users, provides hiring-related tools, and
            facilitates employer payments for Mzobs services.
          </p>
          <p className="text-[15.5px] text-(--explorer-muted) leading-relaxed font-medium">
            This Privacy Policy explains how Mzobs collects, receives, uses, stores, processes, shares, protects, retains,
            and deletes information when you use the Mzobs mobile application, website, APIs, and related services
            (collectively, the &ldquo;Services&rdquo;). By creating an account, accessing, or using the Services, you
            acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className={boxCls}>
            <p className={`${strongCls} mb-2`}>At a glance</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>We do not sell your personal information.</li>
              <li>Candidates: employers see your details when you apply, or when your verified profile is found in their search. Your phone, email and resume stay hidden until an employer unlocks them.</li>
              <li>You can switch off “open to opportunities” to stop appearing in employer searches.</li>
              <li>Employers: your plan, credits, team and enquiry details are used to run your account and to contact you.</li>
              <li>You can ask to access, correct or delete your information at any time.</li>
            </ul>
          </div>
        </>
      }
    />
  )
}
