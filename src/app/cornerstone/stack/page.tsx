export default async function Page() {
  const res = await fetch('http://localhost:3000/api/hellox');
  const data = await res.json();
  console.log(data);

  if (data)
    return (
      <main className="mb-10 ml-8">
        <div className="ml-8 text-2xl text-blue-600">Stack Series</div>
        <div className="flex flex-wrap">
          <div className="ml-8">
            {/*  <StackBasic />
           <StackAPI />
            <StackVOISigmoid /> */}
          </div>

          {/* <div className="ml-4 mt-8">
            <StackAPI />
          </div>
          <div className="ml-4 mt-8">
            <StackVOISigmoid />
          </div>
          <div className="ml-4 mt-8">
            <StackCanvasToWorld />
          </div>
          <div className="ml-4 mt-8">
            <StackEvents />
          </div>
          <div className="ml-4 mt-8">
            <VolumeBasic />
          </div>
          <div className="ml-4 mt-8">
            <VolumeAPI />
          </div>
        <CrossHairs /> */}
        </div>
      </main>
    );
}
