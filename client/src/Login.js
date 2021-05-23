import { Container } from "react-bootstrap";

const CLIENT_ID = "9244ea1428b34f85bc412f784f088d63";
const REDIRECT_URL = "http://localhost:3000";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URL}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

const Login = () => {
  return (
    <Container className="login">
      <a href={AUTH_URL} className="btn btn-success btn-lg">
        Login with Spotify
      </a>
    </Container>
  );
};

export default Login;
