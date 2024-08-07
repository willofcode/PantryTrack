import { Inter } from 'next/font/google';
import {Box, Button, Typography, Stack} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import "../app/globals.css"
import {redirect} from 'next/navigation'

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
          position="absolute"
          color="primary.white"
          alignItems="center"
          width="100vw"
          background="rgba(255, 255, 255, 0.8)"
        >
          <Typography
            variant="h2"
            margin={5}
            paddingTop={10}
            justifyContent={'center'}
            color="white"
            fontFamily={'Inter'}
            fontWeight="bold"
            animation="animatedText"
          >
            Pantry Track
          </Typography>
          <Typography variant="h6" marginBottom={5} color="white">
            Track your pantry inventory seamlessly and efficiently today!
          </Typography>
        </Box>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
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
            Sign Up
          </Button>
        </Link>
      </Stack>{' '}
    </Box>
  )
}