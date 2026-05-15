import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="shrink-0">
      <Image
        src="/focusv-logo.svg"
        alt="Focus V"
        width={120}
        height={24}
        priority
        className="h-6 w-auto"
      />
    </Link>
  );
}
