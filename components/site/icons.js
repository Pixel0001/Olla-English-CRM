import {
  BookOpenIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  ComputerDesktopIcon,
  FaceSmileIcon,
  IdentificationIcon,
  StarIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid'

// Iconițele din lista fiecărui curs (content.js → features)
export const FEATURE_ICONS = {
  display: ComputerDesktopIcon,
  calendar: CalendarDaysIcon,
  calendarDay: CalendarIcon,
  clock: ClockIcon,
  book: BookOpenIcon,
  laugh: FaceSmileIcon,
  star: StarIcon,
  card: IdentificationIcon,
  video: VideoCameraIcon,
  personCheck: UserGroupIcon,
}

// Abilitățile de la BAC și Cambridge
export const SKILL_ICONS = {
  speaking: ChatBubbleLeftRightIcon,
  writing: PencilSquareIcon,
  listening: SpeakerWaveIcon,
  reading: BookOpenIcon,
}

export function UserCheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <circle cx="9" cy="7.5" r="4" />
      <path d="M1.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7v.5h-15z" />
      <path d="M15.6 10.3l1.9 1.9 4.2-4.3 1.3 1.3-5.5 5.6-3.2-3.2z" />
    </svg>
  )
}
