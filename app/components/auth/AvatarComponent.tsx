"use client";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";
import SignOutButtonProps from "./SignOutButton";

interface AvatarProps{
    img?: string | null | undefined;
    name?: string | null |undefined;
}

const AvatarComponent: React.FC<AvatarProps> = ({img, name}) => {
  const avatarSrc = img || "@/public/placeholder.png";
  //console.log("Avatar Image:"+avatarSrc);
    return(
        <div className="flex items-center gap-4">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src={avatarSrc}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{name}</p>
            </DropdownItem>
            <DropdownItem key="settings">
              My Profile
            </DropdownItem>
            <DropdownItem key="team_settings">My Settings</DropdownItem>
            <DropdownItem key="analytics">
              Analytics
            </DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">
              Help & Feedback
            </DropdownItem>
            <DropdownItem  key="logout" color="danger">
                    <SignOutButtonProps />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
}

export default AvatarComponent;