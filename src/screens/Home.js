import FooterFE from "../components/FooterFE";
import DefaultLayout from "../layouts/DefaultLayout";
import { Container } from "react-bootstrap";
export default function Home() {
    return (
        <DefaultLayout>
            {/* Có thể xóa container đi để thêm content vào đấy */}
            <Container fluid >
                <div className="test" style={{ height: '56vh' }}>Middle</div>
            </Container>
        </DefaultLayout>
    )
}