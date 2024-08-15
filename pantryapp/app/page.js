import { Inter } from 'next/font/google';
import {Box, Button, Typography, Stack} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import "../app/globals.css"
import {redirect} from 'next/navigation'

function Copyright(props) {
  return (
    <Typography variant="body2" color="White" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Pantry Tracker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Home() {
//   const {userId} = auth()

//   if (userId) {
//     redirect('/main')
//   }
  return (
      <Box
          height="100vh"
          width="100vw"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{backgroundImage: 'linear-gradient(to right, #ff6e7f, #bfe9ff)'}}
          position="relative"
          overflow={"hidden"}
        >
          <Image
            priority={true}
            src="/landingpage.jpg"
            alt="window "
            display="flex"
            media="screen"
            layout="fill"
            objectFit="cover"
          />{' '}
          <Box
            position="absolute"
            width="100vw"
            height="100vh"
            sx={{
              backgroundImage:
                'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
            }}
          >
            {' '}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-around"
              position="absolute"
              color="primary.white"
              alignItems="center"
              width="100vw"
              background="rgba(255, 255, 255, 0.8)"
            >
              <Typography
                variant="h2"
                margin={2}
                paddingTop={15}
                justifyContent='center'
                color="white"
                align="center"
                fontFamily='PT Sans'
                fontWeight="bold"
                animation="animatedText"
              >
                Pantry Track
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  position: 'relative',
                  paddingBottom: 2,
                  fontFamily: 'PT Sans',
                }}
              >
                <Link href="/section/tracker" passHref>
                  <Button variant="contained">
                    Demo
                  </Button>
                </Link>
                <Link href="/section/sign-in" passHref>
                  <Button variant="contained">
                    Sign In
                  </Button>
                </Link>
                <Link href="/section/sign-up" passHref>
                  <Button variant="contained">
                    Sign Up Today!
                  </Button>
                </Link>
              </Stack>{' '}
              <Typography variant="h6" fontFamily='PT Sans' marginBottom={5} color="white" direction="row" align='center'>
                Track your pantry inventory seamlessly and efficiently with AI powered tools at your fingertips!
              </Typography>
              <Box marginTop={40} color="white" direction="row" align='center'>
                <Copyright sx={{ bottom: 0 }} />
              </Box>
            </Box>
          </Box>
        </Box>
  )
}        