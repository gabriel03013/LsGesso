const Home = () => {
  return (
    // teste de estilizacao dos componentes form
    <div className="w-screen h-screen bg-zinc-500 flex items-center justify-center">
      <form action="" className="bg-white flex flex-col h-[50%] w-[20%]">

        <div className="flex flex-col gap-1">
          <label htmlFor="">Nome</label>
          <input type="text" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Email</label>
          <input type="text" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input type="text" />
        </div>

      </form>
    </div>
  );
};

export default Home;
