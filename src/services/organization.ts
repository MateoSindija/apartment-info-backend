import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';

import { Organization } from '@models/organization';
import { ForbiddenError } from '@errors/appError';

@Service()
export default class OrganizationService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetOrganizations(userId: string): Promise<Organization[]> {
        this.Logger.info('Getting organizations!');

        const organizations = await Organization.findAll({
            where: { ownerId: userId },
        });

        this.Logger.info('Found organizations!');

        return organizations;
    }
    public async CreateOrganization(
        name: string,
        ownerId: string
    ): Promise<string> {
        this.Logger.info('Creating new organization!');

        const organization = await Organization.create({
            name: name,
            ownerId: ownerId,
        });

        this.Logger.info('Created new organization!');

        return organization.organizationId;
    }

    public async UpdateOrganization(
        name: string,
        organizationId: string,
        userId: string
    ): Promise<void> {
        this.Logger.info('Updating organization!');

        const organization = await Organization.findByPk(organizationId);

        if (organization?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');
        await Organization.update(
            {
                name: name,
            },
            { where: { organizationId: organizationId } }
        );

        this.Logger.info('Updated  organization!');
    }

    public async DeleteOrganization(
        organizationId: string,
        userId: string
    ): Promise<void> {
        this.Logger.info('Deleting organization!');
        const organization = await Organization.findByPk(organizationId);

        if (organization?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await Organization.destroy({
            where: { organizationId: organizationId },
        });

        this.Logger.info('Organization deleted!');
    }
}
