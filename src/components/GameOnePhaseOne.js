import PropTypes from "prop-types"; // 1. Muista import!

export function GameOnePhaseOne({ data }) {
  if (!data) return <p>No data</p>;

  const teksti = data["Virheellinen teksti, virheet punaisella"];
  const maara = data["Virheiden lukumäärä tekstissä"];

  return (
    <div className="phase-one">
      <h2>Etsi virheet!</h2>
      <p
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          background: "#f9f9f9",
        }}
      >
        {teksti}
      </p>
      <p>
        Sinun pitäisi löytää <strong>{maara}</strong> virhettä.
      </p>
    </div>
  );
}

// 2. Lisää tämä määrittely funktion alapuolelle:
GameOnePhaseOne.propTypes = {
  data: PropTypes.shape({
    "Virheellinen teksti, virheet punaisella": PropTypes.string,
    "Virheiden lukumäärä tekstissä": PropTypes.number,
  }).isRequired,
};
