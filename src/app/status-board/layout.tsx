export default function StatusBoardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel='stylesheet'
        as='style'
        crossOrigin='anonymous'
        href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-gov-dynamic-subset.min.css'
      />
      <div className='font-pretendardGOV'>{children}</div>
    </>
  );
}
