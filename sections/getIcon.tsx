import {
    Stethoscope,
    HeartPulse,
    Baby,
    Users,
    Syringe,
    Ear,
    Eye,
    Bone,
    Brain,
    TestTube,
    BrainCircuit,
    Activity,
    Radiation,
    ShieldPlus,
    AlertTriangle,
    Droplet,
    FlaskConical,
    Orbit,
    Skull,
    HeartCrack,
    BabyIcon,
    Scissors,
    Sparkles,
    Hourglass,
} from "lucide-react";

export const getIcon = (name: string) => {
    switch (name) {
        case 'internal-medicine':
            return <Stethoscope />
        case 'general-surgery':
            return <Stethoscope />
        case 'cardiology':
            return <HeartPulse />
        case 'obstetrics-gynecology':
            return <Baby />
        case 'pediatrics':
            return <Users />
        case 'dermatology-venereology':
            return <Syringe />
        case 'ent':
            return <Ear />
        case 'ophthalmology':
            return <Eye />
        case 'orthopedics':
            return <Bone />
        case 'neurology':
            return <Brain />
        case 'urology':
            return <TestTube />
        case 'dentistry':
            return <TestTube />
        case 'psychiatry':
            return <BrainCircuit />
        case 'physical-medicine-rehabilitation':
            return <Activity />
        case 'oncology':
            return <Radiation />
        case 'laboratory-medicine':
            return <FlaskConical />
        case 'radiology':
            return <ShieldPlus />
        case 'emergency-medicine':
            return <AlertTriangle />
        case 'pulmonology':
            return <TestTube />
        case 'hematology':
            return <Droplet />
        case 'endocrinology':
            return <Orbit />
        case 'gastroenterology':
            return <FlaskConical />
        case 'nephrology':
            return <TestTube />
        case 'neurosurgery':
            return <Skull />
        case 'cardiothoracic-surgery':
            return <HeartCrack />
        case 'pediatric-surgery':
            return <BabyIcon />
        case 'urologic-surgery':
            return <Scissors />
        case 'plastic-surgery':
            return <Sparkles />
        case 'vascular-surgery':
            return <TestTube />
        case 'geriatrics':
            return <Hourglass />
        case 'anesthesiology-icu':
            return <TestTube />
        default:
            return <Stethoscope />
    }
}                                   