export default function AdminHome() {
    return (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
            <h1>Admin</h1>
            <ul>
                <li><a href="/admin/products">Quản lý sản phẩm</a></li>
                <li><a href="/admin/cards">Tạo & quản lý thiệp</a></li>
            </ul>
        </main>
    );
}
