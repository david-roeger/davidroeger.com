// vite.config.js
import { sveltekit } from "file:///Users/david/Development/davidroeger.com/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { imagetools } from "file:///Users/david/Development/davidroeger.com/node_modules/vite-imagetools/dist/index.mjs";
import svg from "file:///Users/david/Development/davidroeger.com/node_modules/@poppanator/sveltekit-svg/dist/index.js";
var config = {
  define: {
    "process.env.VITE_BUILD_TIME": JSON.stringify(
      `${(/* @__PURE__ */ new Date()).toJSON().split("T")[0]} // ${(/* @__PURE__ */ new Date()).toJSON().split("T")[1].split("Z")[0].split(".")[0]} (UTC)`
    )
  },
  plugins: [
    sveltekit(),
    svg({
      // preserve viewbox
      svgoOptions: {
        plugins: [
          {
            name: "preset-default",
            params: { overrides: { removeViewBox: false } }
          }
        ]
      }
    }),
    imagetools({ force: true })
  ]
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGF2aWQvRGV2ZWxvcG1lbnQvZGF2aWRyb2VnZXIuY29tXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGF2aWQvRGV2ZWxvcG1lbnQvZGF2aWRyb2VnZXIuY29tL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kYXZpZC9EZXZlbG9wbWVudC9kYXZpZHJvZWdlci5jb20vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuXG5pbXBvcnQgeyBpbWFnZXRvb2xzIH0gZnJvbSAndml0ZS1pbWFnZXRvb2xzJztcbmltcG9ydCBzdmcgZnJvbSAnQHBvcHBhbmF0b3Ivc3ZlbHRla2l0LXN2Zyc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ30gKi9cbmNvbnN0IGNvbmZpZyA9IHtcblx0ZGVmaW5lOiB7XG5cdFx0J3Byb2Nlc3MuZW52LlZJVEVfQlVJTERfVElNRSc6IEpTT04uc3RyaW5naWZ5KFxuXHRcdFx0YCR7bmV3IERhdGUoKS50b0pTT04oKS5zcGxpdCgnVCcpWzBdfSAvLyAke1xuXHRcdFx0XHRuZXcgRGF0ZSgpLnRvSlNPTigpLnNwbGl0KCdUJylbMV0uc3BsaXQoJ1onKVswXS5zcGxpdCgnLicpWzBdXG5cdFx0XHR9IChVVEMpYFxuXHRcdClcblx0fSxcblx0cGx1Z2luczogW1xuXHRcdHN2ZWx0ZWtpdCgpLFxuXHRcdHN2Zyh7XG5cdFx0XHQvLyBwcmVzZXJ2ZSB2aWV3Ym94XG5cdFx0XHRzdmdvT3B0aW9uczoge1xuXHRcdFx0XHRwbHVnaW5zOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bmFtZTogJ3ByZXNldC1kZWZhdWx0Jyxcblx0XHRcdFx0XHRcdHBhcmFtczogeyBvdmVycmlkZXM6IHsgcmVtb3ZlVmlld0JveDogZmFsc2UgfSB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSksXG5cdFx0aW1hZ2V0b29scyh7IGZvcmNlOiB0cnVlIH0pXG5cdF1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFMsU0FBUyxpQkFBaUI7QUFFcFUsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxTQUFTO0FBR2hCLElBQU0sU0FBUztBQUFBLEVBQ2QsUUFBUTtBQUFBLElBQ1AsK0JBQStCLEtBQUs7QUFBQSxNQUNuQyxJQUFHLG9CQUFJLEtBQUssR0FBRSxPQUFPLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxTQUNsQyxvQkFBSSxLQUFLLEdBQUUsT0FBTyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUFBLElBRTlEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsVUFBVTtBQUFBLElBQ1YsSUFBSTtBQUFBO0FBQUEsTUFFSCxhQUFhO0FBQUEsUUFDWixTQUFTO0FBQUEsVUFDUjtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sUUFBUSxFQUFFLFdBQVcsRUFBRSxlQUFlLE1BQU0sRUFBRTtBQUFBLFVBQy9DO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNELENBQUM7QUFBQSxJQUNELFdBQVcsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUFBLEVBQzNCO0FBQ0Q7QUFFQSxJQUFPLHNCQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
