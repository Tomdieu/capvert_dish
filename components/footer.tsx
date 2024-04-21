import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";


export default function Footer() {
    return (
        <div className={"flex items-center w-full p-6 bg-background z-50"}>
            <Link
        href={"/"}
        className="flex items-center cursor-pointer select-none hover:text-blue-500 drop-shadow-2xl"
      >
            <Image src={"/logo.png"} width={64} height={64} alt="" />
      </Link>

            <div
                className={"w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground md:ml-auto"}>
                <Button variant={"ghost"} size={"sm"}>Privacy Policy</Button>
                <Button variant={"ghost"} size={"sm"}>Terms & Conditions</Button>

            </div>
        </div>
    );
}