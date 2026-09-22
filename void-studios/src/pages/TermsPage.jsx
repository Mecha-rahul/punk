import Terms from '../content/terms-of-service.md?raw'
import { MarkdownBlocks } from './PrivacyPolicyPage'

// /terms — renders src/content/terms-of-service.md. Same renderer as the
// privacy page; edit the markdown, page follows.
export default function TermsPage() {
  return (
    <div className="bg-bg-primary">
      <div className="ak-shell max-w-3xl py-12 sm:py-16">
        <h1 className="font-wordmark text-4xl leading-none tracking-[-0.01em] text-ink sm:text-5xl">
          Terms &amp; Conditions
        </h1>
        <div className="mt-6">
          <MarkdownBlocks md={Terms} />
        </div>
      </div>
    </div>
  )
}
