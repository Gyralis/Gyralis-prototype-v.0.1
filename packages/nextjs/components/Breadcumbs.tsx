"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./Button";
import { ArrowLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface Breadcrumb {
  href: string;
  label: string;
}

export function Breadcrumbs() {
  const path = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const fetchBreadcrumbs = async (): Promise<Breadcrumb[]> => {
    const segments = path.split("/").filter(segment => segment !== "");

    return segments
      .map((segment, index) => {
        if (index < 2) {
          return undefined;
        }

        const href = `/${segments.slice(0, index + 1).join("/")}`;

        return { href, label: segment };
      })
      .filter((segment): segment is Breadcrumb => segment !== undefined);
  };

  useEffect(() => {
    (async () => {
      const result = await fetchBreadcrumbs();
      setBreadcrumbs(result);
    })();
  }, [path]);

  if (!breadcrumbs.length) {
    return <></>;
  }

  return (
    <>
      <div className="my-[2px] border-l-2 border-solid border-neutral-soft-content" />
      <div aria-label="Breadcrumbs" className="flex w-full items-center">
        <ol className="flex w-full items-center overflow-hidden">
          {breadcrumbs.map(({ href, label }, index) => (
            <li key={href} className="flex max-w-[30%] items-center overflow-hidden text-neutral-soft-content">
              {index !== 0 && <ChevronRightIcon className="mx-1 h-5 w-5 flex-shrink-0" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="subtitle2 truncate font-semibold text-neutral-soft-content">{label}</span>
              ) : (
                <Link href={href} className="subtitle2 truncate font-semibold text-primary-content">
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
    // :empty:/:gardens:/:chaindId:/
    if (pathSegments.length === 3) {
      pathSegments.pop();
    }
    const newPath = pathSegments.join("/");
    router.push(newPath);
  };

  return (
    <>
      {path === "/gardens" ? null : (
        <Button
          aria-label="Go back"
          btnStyle="link"
          color="primary"
          onClick={onBackClicked}
          className="subtitle2 w-fit !p-0"
          icon={<ArrowLeftIcon className="h-4 w-4" />}
        >
          Back
        </Button>
      )}
    </>
  );
};
