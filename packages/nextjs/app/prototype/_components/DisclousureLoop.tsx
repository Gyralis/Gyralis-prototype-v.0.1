// import { Disclosure, DisclosureProps, DisclosureButton, DisclosurePanel } from "@headlessui/react";
// import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

// function Example() {
//     return (
//       <div className="mx-auto">
//         <h3 className="text-2xl font-semibold tracking-tight">
//           Active Loops <span className="font-semibold">(1)</span>
//         </h3>
  
//         <dl className="mt-4 divide-y divide-gray-900/10">
//           {/* {faqs.map(faq => ( */}
//           <Disclosure open as={"div" as DisclosureProps["as"]} className="py-6 first:pt-0 last:pb-0">
//             <dt>
//               <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900 border2">
//                 <span className="text-base/7 font-semibold">Some info about the loop</span>
//                 <span className="ml-6 flex h-7 items-center transition-all ease-in-out duration-300">
//                   <ChevronDownIcon
//                     aria-hidden="true"
//                     className="size-6 group-data-[open]:hidden transition-all ease-in-out duration-300"
//                   />
//                   <ChevronUpIcon
//                     aria-hidden="true"
//                     className="size-6 group-[&:not([data-open])]:hidden transition-all ease-in-out duration-300"
//                   />
//                 </span>
//               </DisclosureButton>
//             </dt>
//             <DisclosurePanel as={"div" as DisclosureProps["as"]} className="mt-2 pr-12">
//               {/* <LoopComponent /> */}loop content
//             </DisclosurePanel>
//           </Disclosure>
//           {/* ))} */}
//         </dl>
//       </div>
//     );
//   }