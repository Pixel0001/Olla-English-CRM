import { About, Audience, Courses, Demo, FaqSection, Hero, NextCourse, Reviews, Steps, Team, Ticker, Trial, VideoReviews } from '@/components/site/sections'

// „absolute": fără sufixul „| Olla English" adăugat de layout-ul rădăcină
export const metadata = {
  title: { absolute: 'Olla English – Școală de limbă engleză în Chișinău' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <NextCourse />
      <Courses />
      <Trial />
      <Audience />
      <Reviews />
      <About />
      <Team />
      <VideoReviews />
      <Steps />
      <FaqSection />
      <Demo />
    </>
  )
}
