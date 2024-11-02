import "tailwindcss/tailwind.css";

export async function getServerSideProps(context: any) {
    const { req } = context;
    const sessionCookie = req.cookies["session"];
  
    if (!sessionCookie) {
      // Redirect to login if no session cookie
      return {
        redirect: {
          destination: "/Login",
          permanent: false,
        },
      };
    }
  
    // Pass session data to the page
    return { props: { sessionCookie } };
}

const flowPage = ( { sessionCookie } : any) => {

    return(
        <>

        {/* Very cool prompt bar */}


            {/* <div className="w-screen h-screen flex flex-col justify-items-center items-center gap-12 justify-center">
              <p className="font-bold text-5xl">What do you want to create ?</p>
              <input type="text" placeholder="A flying car" className=" w-1/2 p-3 border-purple-400 border-4 rounded-lg" />
            </div> */}
<div className="flex flex-row items-center  w-screen  h-screen ">
              
        <div className="h-screen flex flex-col items-center justify-center max-w-48 border-r-3 rounded-lg border-gray-700 shadow-lg self-start">
              <div className="flex flex-col gap-6 items-center p-8 w-full">
                  <p>
                    Tool 1
                  </p>
                  <p>
                    Tool 2
                  </p>
                  <p>
                    Tool 3
                  </p>
              </div>
        </div>

        <div className="h-screen min-w-48 justify-center self-center ml-32 align-middle items-center">
              <div className="h-32 w-24 absolute -z-12 p-12 border rounded-lg border-gray-700 shadow-lg bg-gray-400 justify-center items-center">
                <p> Tool 1</p>
              </div>
        </div>
</div>

        </>
    )

}


export default flowPage