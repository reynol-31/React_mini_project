import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { Users } from 'lucide-react';

/**
 * TeamSection Component
 * Design: Minimalist Scientific Precision
 * - Grid layout with hover elevation effect
 * - Scroll reveal animation on cards
 * - Teal accents for visual hierarchy
 */

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Rohith Sheregar',
      role: '',
    },
    {
      name: 'Nishith R Poojary',
      role: '',
    },
    {
      name: "Reynol D'Souza",
      role: '',
    },
    {
      name: 'Prajwal Shanbhag',
      role: '',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="team" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-16">
            <span className="section-label">Our Team</span>
            <h2 className="section-title mt-4 mb-4">Meet the Developers</h2>
            <p className="text-foreground/70 max-w-2xl text-lg leading-relaxed">
              A dedicated team of students working together to create simple and effective solutions for environmental monitoring.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="p-6 rounded-lg bg-card border border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group cursor-pointer"
              whileHover={{ y: -8 }}
            >
              <div className="mb-4 w-12 h-12 rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center">
                <Users className="text-accent" size={24} />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">
                {member.name}
              </h3>

              <p className="text-accent text-sm font-semibold mb-3 uppercase tracking-wider">
                {member.role}
              </p>

              <p className="text-foreground/70 text-sm leading-relaxed">
                {member.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
