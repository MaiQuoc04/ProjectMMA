import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/config/supabaseClient";

const mimeMap: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const getExt = (uri: string) => {
  const rawExt = uri.split(".").pop()?.toLowerCase() ?? "jpg";
  return mimeMap[rawExt] ? rawExt : "jpg";
};

const uploadBinary = async (
  data: ArrayBuffer,
  bucket: "images-original" | "images-generated",
  ownerId: string,
  contentType: string,
  ext: string,
) => {
  const path = `${ownerId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, data, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return {
    path,
    publicUrl: publicUrlData.publicUrl,
  };
};

export const uploadImageFromUri = async (
  uri: string,
  bucket: "images-original" | "images-generated",
  ownerId: string,
) => {
  const ext = getExt(uri);
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Unable to read image from browser memory: ${response.status}`);
    }
    const blob = await response.blob();
    const data = await blob.arrayBuffer();
    const contentType = blob.type || mimeMap[ext];
    return uploadBinary(data, bucket, ownerId, contentType, ext);
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const data = decode(base64);
  return uploadBinary(data, bucket, ownerId, mimeMap[ext], ext);
};

export const uploadBase64Image = async (
  base64: string,
  bucket: "images-original" | "images-generated",
  ownerId: string,
  ext: "png" | "jpg" | "jpeg" | "webp" = "png",
) => {
  const data = decode(base64);
  return uploadBinary(data, bucket, ownerId, mimeMap[ext], ext);
};
