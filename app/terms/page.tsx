import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Nashville Cleaning Directory',
  description: 'Terms of Service for Nashville Cleaning Directory',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">
            Terms of Service
          </h1>

          <div className="space-y-8 text-neutral-700">
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing and using the Nashville Cleaning Directory
                website, you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on the Nashville Cleaning
                Directory website for personal, non-commercial transitory
                viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose or for any
                  public display
                </li>
                <li>Attempt to reverse engineer any software on the website</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>
                  Transfer the materials to another person or &quot;mirror&quot;
                  the materials on any other server
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                3. Disclaimer
              </h2>
              <p>
                The materials on the Nashville Cleaning Directory website are
                provided on an &apos;as is&apos; basis. Nashville Cleaning
                Directory makes no warranties, expressed or implied, and hereby
                disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                4. Limitations
              </h2>
              <p>
                In no event shall Nashville Cleaning Directory or its suppliers
                be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business
                interruption) arising out of the use or inability to use the
                materials on the Nashville Cleaning Directory website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on the Nashville Cleaning Directory
                website could include technical, typographical, or
                photographic errors. Nashville Cleaning Directory does not
                warrant that any of the materials on its website are accurate,
                complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                6. Modifications
              </h2>
              <p>
                Nashville Cleaning Directory may revise these terms of service
                for its website at any time without notice. By using this
                website, you are agreeing to be bound by the then current
                version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                7. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of the State of Tennessee, and you
                irrevocably submit to the exclusive jurisdiction of the courts
                in that location.
              </p>
            </section>

            <section className="pt-8 border-t border-neutral-200">
              <Link
                href="/auth/signup"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Sign Up
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
