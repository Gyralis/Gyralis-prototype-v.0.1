"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./Button";
import { ArrowLeftCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Breadcrumb {
  href: string;
  label: string;
}

export function Breadcrumbs() {
  const path = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const fetchBreadcrumbs = async (): Promise<Breadcrumb[]> => {
      const segments = path.split("/").filter(segment => segment !== "");

      return segments
        .map((segment, index) => {
          if (index < 1) {
            return undefined;
          }

          const href = `/${segments.slice(0, index + 1).join("/")}`;

          return { href, label: segment };
        })
        .filter((segment): segment is Breadcrumb => segment !== undefined);
    };

    (async () => {
      const result = await fetchBreadcrumbs();
      setBreadcrumbs(result);
    })();
  }, [path]);

  if (!breadcrumbs.length) {
    return;
  }

  return (
    <>
      <div className="border-l-2 my-1 border-gray-600" />
      <div aria-label="Breadcrumbs" className="flex w-full items-start">
        <ol className="flex w-full items-center overflow-hidden">
          {breadcrumbs.map(({ href, label }, index) => (
            <li key={href} className="flex max-w-[30%] items-center overflow-hidden">
              {index !== 0 && <ChevronRightIcon className="mx-1 h-5 w-5 flex-shrink-0" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-600 truncate">{label}</span>
              ) : (
                <Link href={href} className="text-gray-600">
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export const GoBackButton = () => {
  const router = useRouter();
  const path = usePathname();

  const onBackClicked = () => {
    const pathSegments = path.split("/");
    pathSegments.pop();
    
    if (pathSegments.length === 3) {
      pathSegments.pop();
    }
    const newPath = pathSegments.join("/");
    router.push(newPath);
  };

  return (
    <>
      {path === "/prototype" ? null : (
        <Button
          aria-label="Go back"
          btnStyle="link"
          color="primary"
          onClick={onBackClicked}
          className="w-fit !p-0 mt-[2px]"
          icon={<ArrowLeftCircleIcon className="h-5 w-5" />}
        >
          Back
        </Button>
      )}
    </>
  );
};
