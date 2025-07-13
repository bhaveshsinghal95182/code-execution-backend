import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Code Execution Platform
          </h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 space-y-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              Hello, Mehul Sir, thank you once again for giving me the opportunity to
              work on this project. This was my first time sshing into a server and
              running a code on it. I learned a lot from this project and I'm grateful
              to you for giving me this opportunity.
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4">Here is the link to working project:</p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/code-execution">Code Execution</Link>
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Architecture</h2>
            <p className="text-gray-300">
              This is the architectural diagram that I used to build this project:
            </p>
            <div className="flex justify-center">
              <Image
                src="/scalable.png"
                alt="Architectural Diagram"
                width={1000}
                height={1000}
                className="rounded-lg border border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Implementation Notes</h3>
              <p className="text-gray-300 leading-relaxed">
                Although when I got to actually implementing the code, I found that the
                code was not as scalable as I thought it would be. I had to make a lot of
                changes to the code to make it more scalable and not only that, I had to
                minimise the scale of this project because I was getting scope creeped.

                SO, the current implementation looks something like this:
                <Image src="/small.png" alt="Architectural Diagram" width={1000} height={1000} />
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">System Overview</h3>
              <p className="text-gray-300 leading-relaxed">
                The Idea of this code execution platform is simple. It uses one main
                container with node 24 alpine image and for each execution, a new user
                with limited resources is created that would first save the code, run it
                and then the user and its files are deleted.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Technology Stack</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Frontend:</strong> Next.js with TypeScript</li>
                <li>• <strong>Backend:</strong> Express.js with TypeScript</li>
                <li>• <strong>Containerization:</strong> Docker with Node 24 Alpine and other languages support</li>
                <li>• <strong>Deployment:</strong> Vercel (Frontend) + VPS (Backend)</li>
                <li>• <strong>Infrastructure:</strong> Nginx, SSL certificates</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4">I'm attaching the code for this project below:</p>
            <Button size="lg" className="bg-gray-600 hover:bg-gray-700 text-white">
              <Link href="https://github.com/bhaveshsinghal95182/code-execution-backend">
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
        <div className="text-center space-y-4 pt-8 border-t border-gray-700">
          <p className="text-lg text-gray-300">
            Hope you like my work and I'm looking forward to the interview.
          </p>
          <p className="text-gray-300">
            Thank you once again for giving me the opportunity to work on this project.
          </p>
          <div className="text-white">
            <p className="font-semibold">Best Regards,</p>
            <p className="text-xl font-bold">Bhavesh Singhal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
