import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import _ from "lodash";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function mapData(data, path) {
  if (!path) return data;
  return _.get(data, path, "N/A");
}
