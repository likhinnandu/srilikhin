import { profile } from '../data/profile'

export const EVENT = 'open-contact'

/** Ask the contact sheet to open with an optional subject line. */
export function openContact(subject = 'Project enquiry') {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { subject } }))
}

export function mailtoUrl(subject: string) {
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}`
}

export function gmailUrl(subject: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent(subject)}`
}

export function outlookUrl(subject: string) {
  return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(profile.email)}&subject=${encodeURIComponent(subject)}`
}
