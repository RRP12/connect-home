/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // webpack(config, options) {
  //   config.module.rules.push({
  //     test: /\.txt$/,
  //     use: "raw-loader",
  //   })
  //   return config
  // },

  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://eqcqtpzktltmqadjcrec.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxY3F0cHprdGx0bXFhZGpjcmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODM0ODQsImV4cCI6MjA0NjU1OTQ4NH0.Ep40X4DMa4f25nOkDuNIZsov_ZxJG6GeiLlO-QZJWU0",
  },
}

export default nextConfig
