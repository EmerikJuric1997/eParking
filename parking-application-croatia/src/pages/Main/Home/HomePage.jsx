import HeroHomeComponent from "../../../components/HeroHome/HeroHomeComponent";
import transition from "../../../services/transition";
 function HomePage() {
  return (
    <div>
        <HeroHomeComponent />
    </div>
  )
}

export default transition(HomePage)
