import { Box, Link, Typography } from "@mui/material"

// TODO: translate
// const LocalizedMission = () => {
//   const t = useTranslations("footer")
//   return (
//     <>
//       <Box
//         sx={{
//           maxWidth: "564px",
//         }}
//       >
//         <Typography variant="body2" textAlign="center">
//           {t("mission.p")}{" "}
//           {t.rich("collaboration", {
//             link: (chunks) => (
//               <Link href="https://tsadra.org/" {...linkAttrs}>
//                 {chunks}
//               </Link>
//             ),
//           })}
//         </Typography>
//       </Box>
//       <Typography variant="body2" textAlign="center" color="text.secondary">
//         {t("engine")}
//       </Typography>
//     </>
//   )
// }

const FallbackMission = () => {
  return (
    <>
      <Box
        sx={{
          maxWidth: "564px",
        }}
      >
        <Typography variant="body2" textAlign="center">
          {"Developed by "}
          <Link href="https://dharmamitra.org/" target="_blank" rel="noopener noreferrer">
            Dharmamitra
          </Link>
          {" in collaboration with the "}
          <Link href="https://tsadra.org/" target="_blank" rel="noopener noreferrer">
            Tsadra Foundation
          </Link>
          {"."}
        </Typography>
      </Box>
    </>
  )
}

export default function Statements() {
  return <FallbackMission />
}
