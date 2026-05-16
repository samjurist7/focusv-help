import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="shrink-0">
      {/* White logo for dark mode */}
      <Image
        src="/focusv-logo.svg"
        alt="Focus V"
        width={120}
        height={24}
        priority
        className="h-6 w-auto dark:block hidden"
      />
      {/* Black logo for light mode */}
      <Image
        src="/focusv-logo-black.svg"
        alt="Focus V"
        width={120}
        height={24}
        priority
        className="h-6 w-auto dark:hidden block"
      />
    </Link>
  );
}
