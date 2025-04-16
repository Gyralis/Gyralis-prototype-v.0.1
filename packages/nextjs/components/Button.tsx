"use client";

import React from "react";

export type Size = "2xl" | "xl" | "lg" | "md" | "sm";

type ButtonProps = {
  type?: "button" | "submit" | "reset" | React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  btnStyle?: BtnStyle;
  color?: Color;
  onClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
  showToolTip?: boolean;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
  tooltipClassName?: string;
  tooltipSide?: "tooltip-top" | "tooltip-bottom" | "tooltip-left" | "tooltip-right";
  children?: React.ReactNode;
  isLoading?: boolean;
  size?: Size;
  icon?: React.ReactNode;
  walletConnected?: boolean;
};

export type Color = "primary" | "secondary" | "tertiary" | "danger" | "disabled";
export type BtnStyle = "filled" | "outline" | "link";

type BtnStyles = Record<BtnStyle, Record<Color, string>>;

const btnStyles: BtnStyles = {
  filled: {
    primary: "border-2 bg-green-500",
    secondary: "",
    tertiary: "",
    danger: "border-2 bg-red-500 ",
    disabled: "bg-slate-300",
  },
  outline: {
    primary: "border-1 border-green-500",
    secondary: "border-1 border-orange-500",
    tertiary: "",
    danger: "border-1 border-red-500",
    disabled: "bg-slate-300",
  },
  link: {
    primary: "",
    //" #00A082	"
    secondary: "",
    tertiary: "",
    danger: "text-red-500",
    disabled: "text-neutral-soft",
  },
};

export function Button({
  onClick,
  className = "",
  disabled = false,
  tooltip,
  showToolTip = false,
  tooltipClassName: tooltipStyles = "",
  tooltipSide = "tooltip-top",
  children,
  btnStyle = "filled",
  color = "primary",
  isLoading = false,
  icon,
  type = "button",
}: ButtonProps) {
  const buttonElement = (
    <button
      type={type}
      className={`${btnStyles[btnStyle][disabled ? "disabled" : color]} flex relative cursor-pointer  justify-center rounded-lg px-6 py-4 transition-all ease-out disabled:cursor-not-allowed h-fit ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      <div className={`${isLoading ? "invisible" : "visible"} flex gap-2 items-center`}>
        {icon && icon} {children}
      </div>
      <span
        className={`loading loading-spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isLoading ? "block" : "hidden"}`}
      />
    </button>
  );

  return disabled || showToolTip ? (
    <div className={`${tooltip ? "tooltip" : ""} ${tooltipSide} ${tooltipStyles}`} data-tip={tooltip ?? ""}>
      {buttonElement}
    </div>
  ) : (
    buttonElement
  );
}
