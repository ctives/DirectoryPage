import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Nashville Cleaning Directory',
  description: 'Privacy Policy for Nashville Cleaning Directory',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-neutral-700">
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Introduction
              </h2>
              <p>
                Nashville Cleaning Directory (&quot;we&quot; or &quot;us&quot; or
                &quot;our&quot;) operates the Nashville Cleaning Directory
                website. This page informs you of our policies regarding the
                collection, use, and disclosure of personal data when you use
                our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Information Collection and Use
              </h2>
              <p>
                We collect several different types of information for various
                purposes to provide and improve our Service to you.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mt-4 mb-2">
                Types of Data Collected:
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Personal Data:</strong> Email address, name, phone
                  number, address, and profile information
                </li>
                <li>
                  <strong>Usage Data:</strong> Browser type, IP address, pages
                  visited, and time/date of visits
                </li>
                <li>
                  <strong>Business Information:</strong> For business owners,
                  company details, services offered, and customer reviews
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Use of Data
              </h2>
              <p>Nashville Cleaning Directory uses the collected data for:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Providing and maintaining our Service</li>
                <li>Notifying you about changes to our Service</li>
                <li>
                  Allowing you to participate in interactive features of our
                  Service
                </li>
                <li>Providing customer support</li>
                <li>
                  Gathering analysis or valuable information so we can improve
                  our Service
                </li>
                <li>Monitoring the usage of our Service</li>
                <li>Detecting, preventing and addressing technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Security of Data
              </h2>
              <p>
                The security of your data is important to us but remember that
                no method of transmission over the Internet or method of
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your Personal Data, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;effective date&quot; at the
                top of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="mt-4">
                Nashville Cleaning Directory
                <br />
                Email: privacy@nashvillecleaningdirectory.com
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
