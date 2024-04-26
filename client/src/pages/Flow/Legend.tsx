import {ACTION_TO_NAME} from "./Constants";

// @ts-ignore
const Legend = ({ interactionColorMap, interactionNames }) => {
    let opactityVal:number = 0.3;

    console.log(interactionNames.size);
    if (interactionNames.size === 0) {
        opactityVal = 0;
    }
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: `rgba(100, 100, 100, ${opactityVal})`, // Grey background with 50% opacity
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {Array.from(interactionNames).map((name) => (
        <div
        // @ts-ignore
          key={name}
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <div
            style={{
              width: "40px",
              height: "2px",
              borderRadius: "50%",
              // @ts-ignore
              backgroundColor: interactionColorMap[name],
              marginRight: "10px",
            }}
          ></div>
          {/* @ts-ignore */}
          <div style={{color: "#fff"}}>{ACTION_TO_NAME[name]}</div>
        </div>
      ))}
    </div>
  );
};

export default Legend;
