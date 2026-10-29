// Draft candidate stories for the home page's "Every Career Has a Story" wall.
//
// EDIT HERE. These are DRAFTS: have each candidate approve or personalise their
// own words before this ships. They make no placement claim, so none carries
// `placementVerified` — only set it to true once Mzobs has actually confirmed
// that candidate's placement. To show a real photo, drop an approved image in
// public/images/candidates/ and set `photo` to e.g. '/images/candidates/shalini-singh.jpg';
// without one the card shows the candidate's initials.
//
// Shown only while the live API (see testimonials.js) has no approved
// testimonials; once real ones exist they replace these.
export const DRAFT_CANDIDATE_STORIES = [
  {
    id: 'draft-shalini-singh',
    name: 'Shalini Singh',
    photo: '/images/candidates/shalini-singh.svg',
    tagline: 'My Career, My New Beginning',
    feedback: 'Mzobs gave me the confidence to take the next step and turn my career aspirations into new opportunities.',
  },
  {
    id: 'draft-utkarsh-dwivedi',
    name: 'Utkarsh Dwivedi',
    photo: '/images/candidates/utkarsh-dwivedi.svg',
    tagline: 'The Right Opportunity, The Right Time',
    feedback: 'The right opportunity can change your direction. Mzobs helped me move closer to the future I was working towards.',
  },
  {
    id: 'draft-atushi-srivastava',
    name: 'Atushi Srivastava',
    photo: '/images/candidates/atushi-srivastava.svg',
    tagline: 'New Possibilities Begin Here',
    feedback: 'For me, Mzobs represents a fresh start, new possibilities, and the courage to dream bigger.',
  },
  {
    id: 'draft-aadradhya-singh',
    name: 'Aadradhya Singh',
    photo: '/images/candidates/aadradhya-singh.svg',
    tagline: 'A Fresh Start, A Stronger Future',
    feedback: 'A new opportunity brought new confidence. I’m excited to keep learning, growing, and building my career.',
  },
  {
    id: 'draft-purvi-sikka',
    name: 'Purvi Sikka',
    photo: '/images/candidates/purvi-sikka.svg',
    tagline: 'Ready for What Comes Next',
    feedback: 'Finding roles that truly matched my skills felt simple with Mzobs. It made me believe my next chapter was within reach.',
  },
  {
    id: 'draft-vatsala-rai',
    name: 'Vatsala Rai',
    photo: '/images/candidates/vatsala-rai.svg',
    tagline: 'Taking the First Step Forward',
    feedback: 'Mzobs made the job search feel clear and less overwhelming, and gave me the push I needed to start my career journey.',
  },
  {
    id: 'draft-sumit-kumar-mishra',
    name: 'Sumit Kumar Mishra',
    photo: '/images/candidates/sumit-kumar-mishra.svg',
    tagline: 'Clarity on the Path Ahead',
    feedback: 'Mzobs gave my job search a clear direction. I could focus on roles that suited me and move ahead with more confidence.',
  },
  {
    id: 'draft-vaishnavi-shukla',
    name: 'Vaishnavi Shukla',
    photo: '/images/candidates/vaishnavi-shukla.svg',
    tagline: 'Believing in My Next Chapter',
    feedback: 'With Mzobs, I felt supported at every step. It helped me present my skills better and look forward to what comes next.',
  },
].map((s) => ({ ...s, placementVerified: false }))
