import Image from "next/image";
import { LoopComponent } from "../_components/LoopComponent";
import { NextPage } from "next";

const Page: NextPage<{ params: { id: string } }> = async ({ params }) => {
  const { id } = params;

  return (
    <div className="">
      <OrganizationHeader title={id} />
      {/* <LoopComponent /> */}
    </div>
  );
};

export default Page;

const OrganizationHeader = ({ title }: { title: string }) => {
  return (
    <div className="">
      <div className="bg-yellow-100 h-24 lg:h-28" />
      <Image
        alt=""
        src={"/1hive-logo.svg"}
        width={75}
        height={75}
        className="size-16 transition-all ease-in-out duration-300 bg-white hover:scale-105 hover:rotate-12 rounded-xl ring-4 ring-white sm:size-20 p-2 -mt-10 ml-4"
      />

      {/* Organization title, description and social media */}
      <div className="sm:flex sm:flex-col sm:min-w-0 sm:flex-1 sm:items-start sm:justify-start px-4">
        <div className="flex gap-6 items-baseline w-full">
          <h1 className="truncate text-2xl md:text-4xl font-bold text-gray-900">{title}</h1>
          <div className="flex gap-2 w-fit">
            <span className="relative z-10 flex items-center justify-center w-5 h-auto text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                shape-rendering="geometricPrecision"
                text-rendering="geometricPrecision"
                image-rendering="optimizeQuality"
                fill-rule="evenodd"
                clip-rule="evenodd"
                viewBox="0 0 512 462.799"
              >
                <path
                  fill-rule="nonzero"
                  d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                />
              </svg>
            </span>

            <span className="relative z-10 flex items-center justify-center w-5 h-auto text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
              <svg
                viewBox="0 -28.5 256 256"
                version="1.1"
                xmlns="http://www.w3.org/1999/xlink"
                preserveAspectRatio="xMidYMid"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g>
                    {" "}
                    <path
                      d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                      fill="#000000"
                      fill-rule="nonzero"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>
              </svg>
            </span>
          </div>
        </div>
        {/* <div className="flex-1">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo repudiandae aliquam nesciunt dolore voluptatibus et praesentium amet tempore totam.</p>
      </div> */}
      </div>
      <LoopComponent />
    </div>
  );
};
