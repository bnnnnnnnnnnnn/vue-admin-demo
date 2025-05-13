// src/api/upload.js
import supabase from "@/services/supabase";

/**
 * 将上传的资源信息写入 Supabase
 * @param {Object} fileInfo - 上传成功的文件信息
 * @param {string} fileInfo.name - 资源名称（无扩展名）
 * @param {string} fileInfo.url - OSS 文件地址
 * @param {string} fileInfo.type - MIME 类型
 * @param {string} fileInfo.md5 - 文件 hash 值
 */
export async function recordUpload(fileInfo) {
  const { data, error } = await supabase.from('resources').insert([{
    name: fileInfo.name,
    url: fileInfo.url,
    type: fileInfo.type,
    md5: fileInfo.md5,
    upload_time: new Date(),
  }])

  if (error) {
    console.error('写入 Supabase 失败', error)
    throw error
  }

  return data
}

/**
 * 检查是否已存在相同 hash 的文件（秒传功能）
 * @param {string} hash
 */
export async function checkFileExistsByHash(hash) {
  const { data, error } = await supabase
    .from('resources')
    .select('id, url')
    .eq('md5', hash)
    .maybeSingle()

  if (error) {
    console.error('查询 Supabase 失败', error)
    throw error
  }

  return data // 返回 null 表示不存在
}
