import HomeThree from '@/components/HomeThree';

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/hellox');
  const data = await res.json();
  // console.log(data);

  if (data)
    return (
      <main className="">
        {/* <div>{data.text}</div> */}
        <HomeThree />
        {/* <HomeThreeRyo /> */}
      </main>
    );
}
