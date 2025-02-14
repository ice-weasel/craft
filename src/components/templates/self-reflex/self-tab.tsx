import React, { useState, useEffect, lazy, Suspense } from "react";
import Nodes from "./nodes";
import Checkers from "./checkers";
import Advanced from "./advanced";
import { useRouter } from "next/router";

// type SelfTabProps = {
//   onTemplateChange :
//   (basicTools:string | null,advancedTools:string | null) => void
// }

const SelfTab = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [basicComponents, setBasicComponents] = useState<JSX.Element[]>([]);
  const [advancedComponents, setAdvancedComponents] = useState<JSX.Element[]>(
    []
  );
  const router = useRouter();
  useEffect(() => {
    const loadTemplate = async () => {
      const { template } = router.query; // Assume `template` is the template name
      if (template) {
        try {
          const { basic, advanced } = await import(
            `@/components/templates/${template}.js`
          );

          const basicImports = await Promise.all(
            basic.map(async (comp: any) => {
              const Component = (
                await import(
                  `@/components/templates/self-reflex/${comp.toLowerCase()}`
                )
              ).default;
              return <Component key={comp} />;
            })
          );
          setBasicComponents(basicImports);

          const advancedImports = await Promise.all(
            advanced.map(async (comp: any) => {
              const Component = (
                await import(
                  `@/components/templates/self-reflex/${comp.toLowerCase()}`
                )
              ).default;
              return <Component key={comp} />;
            })
          );
          setAdvancedComponents(advancedImports);
        } catch (error) {
          console.error("Error loading template:", error);
        }
      } else {
        // Load a generic or empty template if no template is selected
        const basic = ["all-tools"];
        const advanced = ["Advanced"];

        const basicImports = await Promise.all(
          basic.map(async (comp: any) => {
            const Component = (
              await import(
                `@/components/templates/self-reflex/${comp.toLowerCase()}`
              )
            ).default;
            return <Component key={comp} />;
          })
        );
        setBasicComponents(basicImports);

        const advancedImports = await Promise.all(
          advanced.map(async (comp: any) => {
            const Component = (
              await import(
                `@/components/templates/self-reflex/${comp.toLowerCase()}`
              )
            ).default;
            return <Component key={comp} />;
          })
        );
        setAdvancedComponents(advancedImports);
      }
    };

    loadTemplate();
  }, [router.query]);

  return (
    <div className="p-5">
      <div className="">
        <h1 className="text-lg  text-white font-semibold">Tool Box</h1>
        <hr className="h-[1.5px] my-3 bg-indigo-500 border-0 " />
      </div>

      <div className="flex space-x-4  border-b border-gray-200 text-left ">
        <button
          className={`px-4 py-2 text-md text-left transition ${
            activeTab === 0
              ? "text-indigo-400 border-b-2 border-indigo-300 font-bold"
              : "text-white"
          }`}
          onClick={() => setActiveTab(0)}
        >
          Basic
        </button>
        <button
          className={`px-4 py-2 text-md transition ${
            activeTab === 1
              ? "text-indigo-400 border-b-2 border-indigo-300 font-bold"
              : "text-white"
          }`}
          onClick={() => setActiveTab(1)}
        >
          Advanced
        </button>
      </div>
      <Suspense  fallback={<div>Loading...</div>}>
        {activeTab === 0 && <div className="flex flex-col  gap-5 h-full justify-center  ">{basicComponents}</div>}
        {activeTab === 1 && <div className="flex flex-col  gap-5 h-full justify-center  ">{advancedComponents}</div>}
      </Suspense>
    </div>
  );
};

export default SelfTab;
