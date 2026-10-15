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
    photo: '',
    tagline: 'My Career, My New Beginning',
    feedback: 'Mzobs gave me the confidence to take the next step and turn my career aspirations into new opportunities.',
  },
  {
    id: 'draft-utkarsh-dwivedi',
    name: 'Utkarsh Dwivedi',
    photo: '',
    tagline: 'The Right Opportunity, The Right Time',
    feedback: 'The right opportunity can change your direction. Mzobs helped me move closer to the future I was working towards.',
  },
  {
    id: 'draft-sumit-kumar-mishra',
    name: 'Sumit Kumar Mishra',
    photo: '',
    tagline: 'Every Journey Starts Somewhere',
    feedback: 'Every career has a starting point, and Mzobs helped make my next step feel possible.',
  },
  {
    id: 'draft-aadradhya-singh',
    name: 'Aadradhya Singh',
    photo: '',
    tagline: 'A Fresh Start, A Stronger Future',
    feedback: 'A new opportunity brought new confidence. I’m excited to keep learning, growing, and building my career.',
  },
  {
    id: 'draft-atushi-srivastava',
    name: 'Atushi Srivastava',
    photo: '',
    tagline: 'New Possibilities Begin Here',
    feedback: 'For me, Mzobs represents a fresh start, new possibilities, and the courage to dream bigger.',
  },
].map((s) => ({ ...s, placementVerified: false }))
