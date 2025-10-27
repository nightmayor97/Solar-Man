import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
}

const Card: React.FC<CardProps & React.HTMLAttributes<HTMLDivElement>> = ({ children, className, title, icon, ...props }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...props}>
            {title && (
                <div className="flex items-center mb-4">
                    {icon && <div className="mr-3 text-primary">{icon}</div>}
                    <h3 className="text-xl font-semibold text-secondary-dark">{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;