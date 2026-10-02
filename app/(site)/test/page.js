import { ZoomImage } from '@/components/site/interactive'
import { WRAP } from '@/components/site/ui'

export const metadata = {
  title: 'Test',
  robots: { index: false, follow: true },
}

export default function TestPage() {
  return (
    <section className="px-4 sm:px-[18px] py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]">
      <div className={WRAP}>
        <ZoomImage src="/site/curs-engleza-8.jpg" className="mx-auto max-w-[800px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/site/curs-engleza-8.jpg" alt="Olla English" className="w-full" />
        </ZoomImage>
      </div>
    </section>
  )
}
